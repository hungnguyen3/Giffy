import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logIn, logOut } from '../../slices/UserAuthSlice';
import {
	getCollectionsByUserId,
	getGiffiesByCollectionId,
	getUserByFirebaseAuthId,
} from '../../API/serverHooks';
import { clearUser, populateUser } from '../../slices/UserSlice';
import {
	collectionDTO,
	GetCollectionsByUserIdDTO,
	isGetCollectionsByUserIdDTO,
} from '../../API/types/collections-types';
import { giffyDTO } from '../../API/types/giffies-types';
import {
	clearCollections,
	Collection,
	populateCollections,
} from '../../slices/CollectionsSlice';
import { app } from '../Firebase/FirebaseInit';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { ErrorDTO } from '../../API/types/errors-types';

interface onCollectionsRoutePopulationProps {
	dispatch: ThunkDispatch<any, any, any>;
	router: NextRouter;
	setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export const onCollectionsRoutePopulation = (
	props: onCollectionsRoutePopulationProps
) => {
	const { dispatch, router, setLoggedIn } = props;

	onAuthStateChanged(getAuth(app), user => {
		if (user) {
			const userAuth = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
			};

			getUserByFirebaseAuthId(userAuth.uid)
				.then(user => {
					if (user.error) {
						return null;
					}
					const userInfo = {
						userId: user.userId,
						userName: user.userName,
						profileImgUrl: user.profileImgUrl,
					};

					if (userInfo.profileImgUrl && userInfo.userId && userInfo.userName)
						props.dispatch(populateUser(userInfo));
					return userInfo;
				})
				.then(userInfo => {
					if (!userInfo) {
						return null;
					}
					getCollectionsByUserId(userInfo.userId)
						.then((response: GetCollectionsByUserIdDTO | ErrorDTO) => {
							if (!isGetCollectionsByUserIdDTO(response)) {
								return null;
							}

							var collections = response.data;
							var toStoreCollections: Collection[] = [];

							collections.map((collection: collectionDTO) => {
								getGiffiesByCollectionId(Number(collection.collectionId)).then(
									(giffies: giffyDTO[] | any) => {
										if (giffies.error) {
											return null;
										}
										toStoreCollections = [
											...toStoreCollections,
											{
												collectionId: collection.collectionId,
												collectionName: collection.collectionName,
												private: collection.private,
												giffies: giffies,
											},
										];
										dispatch(populateCollections(toStoreCollections));
									}
								);
							});

							const collectionIds = collections.map(
								(collection: collectionDTO) => collection.collectionId
							);

							return collectionIds.length > 0 ? Math.min(...collectionIds) : 0;
						})
						.then(firstCollectionId => {
							if (
								firstCollectionId !== null &&
								firstCollectionId !== undefined &&
								!router.route.includes('discovery')
							) {
								router.push(`/collections/${firstCollectionId}`);
							}
						});
				});

			dispatch(logIn(userAuth));
			setLoggedIn(true);
		} else {
			dispatch(logOut());
			dispatch(clearUser());
			dispatch(clearCollections());
			setLoggedIn(false);
			router.push('/auth');
		}
	});
};
