import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logIn, logOut, UserAuth } from '../../slices/UserAuthSlice';
import { getCurrentUser } from '../../API/userHooks';
import { clearUser, populateUser } from '../../slices/UserSlice';
import {
	CollectionDTO,
	GetCurrentUserCollectionsDTO,
	isGetCurrentUserCollectionsDTO,
} from '../../API/types/collections-types';
import {
	GetGiffiesByCollectionIdDTO,
	GiffyDTO,
	isGetGiffiesByCollectionIdDTO,
} from '../../API/types/giffies-types';
import {
	clearCollections,
	Collection,
	populateCollections,
	UserAccess,
} from '../../slices/CollectionsSlice';
import { app } from '../Firebase/FirebaseInit';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { ErrorDTO, isErrorDTO } from '../../API/types/errors-types';
import { getCurrentUserCollections } from '../../API/collectionHooks';
import { getGiffiesByCollectionId } from '../../API/giffyHooks';
import {
	GetCurrentUserDTO,
	isGetCurrentUserDTO,
} from '../../API/types/users-types';
import { getUsersByCollectionId } from '../../API/collectionUserRelationshipsHooks';

interface onCollectionsRoutePopulationProps {
	dispatch: ThunkDispatch<any, any, any>;
	router: NextRouter;
	setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

// Function to populate user information
export const populateUserInfo = (dispatch: ThunkDispatch<any, any, any>) => {
	return new Promise<{
		userId: number;
		userName: string;
		profileImgUrl: string;
	}>((resolve, reject) => {
		getCurrentUser()
			.then((response: ErrorDTO | GetCurrentUserDTO) => {
				if (!isGetCurrentUserDTO(response)) {
					return reject();
				}

				var user = response.data;

				const userInfo = {
					userId: user.userId,
					userName: user.userName,
					userEmail: user.userEmail,
					profileImgUrl: user.profileImgUrl,
				};

				if (userInfo.profileImgUrl && userInfo.userId && userInfo.userName) {
					dispatch(populateUser(userInfo));
				}
				return resolve(userInfo);
			})
			.catch(() => {
				reject();
			});
	});
};

// Function to populate collections
const populateCollectionsInfo = (dispatch: ThunkDispatch<any, any, any>) => {
	return new Promise((resolve, reject) => {
		getCurrentUserCollections()
			.then((response: GetCurrentUserCollectionsDTO | ErrorDTO) => {
				if (!isGetCurrentUserCollectionsDTO(response)) {
					return reject();
				}

				var collections = response.data;
				var toStoreCollections: Collection[] = [];

				collections.map(async (collection: CollectionDTO) => {
					var users = await getUsersByCollectionId(collection.collectionId);
					if (isErrorDTO(users)) return null;

					const usersObject = users.data.reduce((acc, user) => {
						(acc as { [userEmail: string]: UserAccess })[user.userEmail] = {
							collectionId: collection.collectionId,
							user: {
								userId: user.userId,
								userName: user.userName,
								userEmail: user.userEmail,
								profileImgUrl: user.profileImgUrl,
							},
							permission: user.permission,
						};
						return acc;
					}, {});

					getGiffiesByCollectionId(Number(collection.collectionId)).then(
						(response: ErrorDTO | GetGiffiesByCollectionIdDTO) => {
							if (!isGetGiffiesByCollectionIdDTO(response)) {
								return null;
							}
							var giffies: GiffyDTO[] = response.data;

							toStoreCollections = [
								...toStoreCollections,
								{
									collectionId: collection.collectionId,
									collectionName: collection.collectionName,
									private: collection.private,
									giffies: giffies,
									users: usersObject,
								},
							];

							dispatch(populateCollections(toStoreCollections));
						}
					);
				});

				const collectionIds = collections.map(
					(collection: CollectionDTO) => collection.collectionId
				);
				resolve(collectionIds.length > 0 ? Math.min(...collectionIds) : 0);
			})
			.catch(() => {
				reject();
			});
	});
};

// Original function modified to call the new functions
export const onCollectionsRoutePopulation = (
	props: onCollectionsRoutePopulationProps
) => {
	const { dispatch, router, setLoggedIn } = props;

	// clear collections every time we change route
	dispatch(clearCollections());

	onAuthStateChanged(getAuth(app), user => {
		if (user) {
			// TODO: handle idToken
			const userAuth = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
			};

			populateUserInfo(dispatch)
				.then(userInfo => {
					if (!userInfo) {
						return null;
					}
					return populateCollectionsInfo(dispatch);
				})
				.then(firstCollectionId => {
					if (
						firstCollectionId !== null &&
						firstCollectionId !== undefined &&
						!router.route.includes('discovery')
					) {
						router.push(`/collections/${firstCollectionId}`);
					}
				})
				.catch(() => {
					router.push(`/collections/0`);
				});

			dispatch(logIn(userAuth));
			setLoggedIn(true);
		} else {
			dispatch(logOut());
			dispatch(clearUser());
			dispatch(clearCollections());
			setLoggedIn(false);
		}
	});
};
