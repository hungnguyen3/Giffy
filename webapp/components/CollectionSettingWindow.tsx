import router from 'next/router';
import { KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCollectionById } from '../API/collectionHooks';
import { useAppSelector } from '../hooks';
import {
	closeCollectionSettingWindow,
	closeCreateNewCollectionWindow,
	Collection,
	updateCollection,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import { isUpdateCollectionByIdDTO } from '../API/types/collections-types';
import styles from '../styles/CollectionSettingWindow.module.scss';
import {
	openCreateNewCollectionWindow,
	openDeleteConfirmationWindow,
	selectACollectionToDelete,
} from '../slices/CollectionsSlice';

export const CollectionSettingWindow = () => {
	const { collectionId } = router.query;
	const dispatch = useDispatch();
	const collection: Collection = useAppSelector(
		(state: RootState) => state.collections.value[Number(collectionId)]
	);
	const [updateCollectionPayload, setUpdateCollectionPayload] = useState<{
		collectionId: number;
		collectionName: string;
		private: boolean;
	}>({
		collectionId: Number(collectionId),
		collectionName: collection.collectionName,
		private: collection.private,
	});

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
				onSubmit={() => {
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
