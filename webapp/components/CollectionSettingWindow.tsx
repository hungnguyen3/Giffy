import router from 'next/router';
import { KeyboardEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { Collection, updateCollection } from '../slices/CollectionsSlice';
import { RootState } from '../store';
import styles from '../styles/CollectionSettingWindow.module.scss';

export const CollectionSettingWindow = () => {
	const { collectionId } = router.query;
	const collection: Collection = useAppSelector(
		(state: RootState) =>
			state.collections.value.filter(
				collection => collection.collectionId == Number(collectionId)
			)[0]
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
	const dispatch = useDispatch();
	const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault();

		// send API request with updateCollectionPayload
		dispatch(updateCollection(updateCollectionPayload));
	};

	return (
		<div className={styles.centeredBox}>
			<form
				onSubmit={() => {
					handleSubmit;
				}}
			>
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
								handleSubmit(event);
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
				<input
					type="submit"
					value="Save Changes"
					onClick={() => {
						handleSubmit(event);
					}}
				/>
			</form>
		</div>
	);
};
