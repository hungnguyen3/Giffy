import router from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import {
	addUsersToACollection,
	closeCollectionSettingWindow,
	Collection,
	updateCollection,
	UserAccess,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import styles from '../styles/CollectionSettingWindow.module.scss';
import { openDeleteConfirmationWindow, selectACollectionToDelete } from '../slices/CollectionsSlice';
import CollectionPermissionBox, { UserPermission } from './CollectionPermissionBox';
import UserService from '../API/UserService';
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import { UserDTO } from '../types/DTOs/UserDTOs';
import { addUserToACollection } from '../API/CollectionUserRelationshipService';
import { updateCollectionById } from '../API/CollectionService';
import { isUpdateCollectionByIdDTO } from '../types/DTOs/CollectionDTOs';

export const CollectionSettingWindow = () => {
	const { collectionId } = router.query;
	const dispatch = useDispatch();
	const collection: Collection = useAppSelector((state: RootState) => state.collections.value[Number(collectionId)]);
	const collectionUsers: { [userEmail: string]: UserAccess } = useAppSelector(
		(state: RootState) => state.collections.value[Number(collectionId)].users
	);
	const [updateCollectionPayload, setUpdateCollectionPayload] = useState<{
		collectionId: number;
		collectionName: string;
		private: boolean;
		// TODO: list of users here
	}>({
		collectionId: Number(collectionId),
		collectionName: collection.collectionName,
		private: collection.private,
	});

	const usersWithAccess = Object.keys(collectionUsers).map((userEmail) => {
		const collectionUser = collectionUsers[userEmail];
		return {
			collectionId: collectionUser.collectionId,
			userEmail: collectionUser.user.userEmail,
			permission: collectionUser.permission,
		};
	});
	const [users, setUsers] = useState<UserPermission[]>(usersWithAccess);

	const handleAddUser = async (userPermission: UserPermission) => {
		const getUserByEmailRes: ResponseMessage<UserDTO> = await UserService.getUserByEmail(userPermission.userEmail);

		if (!isResponseMessageSuccess(getUserByEmailRes)) {
			alert(getUserByEmailRes.message);
			return null;
		}

		const userId = getUserByEmailRes.data!.userId;

		const userProps = {
			collectionId: userPermission.collectionId,
			userId: userId,
			permission: userPermission.permission,
		};

		const addUserToACollectionResponse = await addUserToACollection(userProps);
		if (isResponseMessageSuccess(addUserToACollectionResponse)) {
			setUsers([...users, userPermission]);
			dispatch(
				addUsersToACollection({
					collectionId: userPermission.collectionId,
					user: getUserByEmailRes.data!,
					permission: userPermission.permission,
				})
			);
		} else {
			alert('Adding user to collection failed!');
		}
	};

	const handleSubmit = async () => {
		// send API request with updateCollectionPayload
		const updateCollectionByIdRes = await updateCollectionById({
			collectionId: updateCollectionPayload.collectionId,
			collectionName: updateCollectionPayload.collectionName,
			private: updateCollectionPayload.private,
		});

		if (isUpdateCollectionByIdDTO(updateCollectionByIdRes)) {
			// update collection in redux store
			dispatch(updateCollection(updateCollectionPayload));
		} else {
			alert('Error updating collection');
		}
	};

	return (
		<div className={styles.centeredBox}>
			<form
				onSubmit={(event) => {
					event.preventDefault(); // prevent page refresh
					handleSubmit;
				}}
			>
				<div className={styles.centeredBox}>
					<div className={styles.name}>
						Collection name: &nbsp;
						<input
							type="text"
							value={updateCollectionPayload.collectionName}
							onChange={(event) => {
								setUpdateCollectionPayload({
									...updateCollectionPayload,
									collectionName: event.target.value,
								});
							}}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									handleSubmit();
								}
							}}
						></input>
					</div>
					<div className={styles.visibility}>
						Visibility: &nbsp;
						<select
							value={updateCollectionPayload.private ? 'private' : 'public'}
							onChange={(event) => {
								setUpdateCollectionPayload({
									...updateCollectionPayload,
									private: event.target.value === 'private',
								});
							}}
						>
							<option value="private">Private</option>
							<option value="public">Public</option>
						</select>
					</div>
					<div>
						<CollectionPermissionBox users={users} onAddUser={handleAddUser} />
					</div>
				</div>

				<div className={styles.buttonContainer}>
					<input
						className={styles.saveBtn}
						type="submit"
						value="Save"
						onClick={(e) => {
							e.preventDefault();
							handleSubmit();
							dispatch(closeCollectionSettingWindow());
						}}
					/>
					<button
						className={styles.deleteButton}
						onClick={() => {
							dispatch(selectACollectionToDelete(Number(collectionId)));
							dispatch(closeCollectionSettingWindow());
							dispatch(openDeleteConfirmationWindow());
						}}
					>
						Delete
					</button>
				</div>
			</form>
		</div>
	);
};
