import router from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCollectionById } from '../API/collectionHooks';
import { useAppSelector } from '../hooks';
import {
	closeCollectionSettingWindow,
	Collection,
	updateCollection,
	UserAccess,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import { isUpdateCollectionByIdDTO } from '../API/types/collections-types';
import styles from '../styles/CollectionSettingWindow.module.scss';
import {
	openDeleteConfirmationWindow,
	selectACollectionToDelete,
} from '../slices/CollectionsSlice';
import CollectionPermissionBox, {
	UserPermission,
} from './CollectionPermissionBox';
import { getUserByEmail } from '../API/userHooks';
import { ErrorDTO, isErrorDTO } from '../API/types/errors-types';
import { GetUserByEmailDTO } from '../API/types/users-types';
import { addUserToACollection } from '../API/collectionUserRelationshipsHooks';

export const CollectionSettingWindow = () => {
	const { collectionId } = router.query;
	const dispatch = useDispatch();
	const collection: Collection = useAppSelector(
		(state: RootState) => state.collections.value[Number(collectionId)]
	);
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

	const usersWithAccess = Object.keys(collectionUsers).map(userEmail => {
		const collectionUser = collectionUsers[userEmail];
		return {
			collectionId: collectionUser.collectionId,
			userEmail: collectionUser.user.userEmail,
			permission: collectionUser.permission,
		};
	});
	const [users, setUsers] = useState<UserPermission[]>(usersWithAccess);

	const handleAddUser = async (user: UserPermission) => {
		const userInfo: GetUserByEmailDTO | ErrorDTO = await getUserByEmail(
			user.userEmail
		);

		if (isErrorDTO(userInfo)) {
			alert('Invalid User Email');
			return null;
		}

		const userId = userInfo.data.userId;

		const userProps = {
			collectionId: user.collectionId,
			userId: userId,
			permission: user.permission,
		};

		const response = await addUserToACollection(userProps);
		if (!isErrorDTO(response)) {
			setUsers([...users, user]);
			console.log(response);
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
				onSubmit={event => {
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
							onChange={event => {
								setUpdateCollectionPayload({
									...updateCollectionPayload,
									collectionName: event.target.value,
								});
							}}
							onKeyDown={event => {
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
							onChange={event => {
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
						onClick={e => {
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
						x
					</button>
				</div>
			</form>
		</div>
	);
};
