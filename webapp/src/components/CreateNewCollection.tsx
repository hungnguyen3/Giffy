import styles from '../styles/CreateNewCollection.module.scss';
import { addNewCollection, closeCreateNewCollectionWindow } from '../slices/CollectionsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useState } from 'react';
import { RootState } from '../store';
import { useRouter } from 'next/router';
import { createCollection } from '../API/CollectionService';
import { isResponseMessageSuccess } from '../types/ResponseMessage';

interface CollectionInfo {
	collectionName: string;
	private: boolean;
	// TODO: add list of shared users, auto clear(?) if private is true
}

const CreateNewCollection = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const userId = useAppSelector((state: RootState) => state.user.value?.userId);
	const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
		collectionName: '',
		private: false,
	});

	const uploadHandler = async () => {
		if (collectionInfo.collectionName == '') {
			alert('Please fill in collection name');
		} else if (!userId) {
			alert("Something went wrong while loading user's info");
		} else {
			try {
				const createCollectionRes = await createCollection({
					data: {
						collectionName: collectionInfo.collectionName,
						private: collectionInfo.private,
						userId: userId,
					},
				});

				if (!isResponseMessageSuccess(createCollectionRes)) {
					alert('Something went wrong trying to create a new collection');
				} else {
					var collection = createCollectionRes.data!;

					dispatch(
						addNewCollection({
							collectionId: collection.collectionId,
							collectionName: collection.collectionName,
							private: collection.private,
							giffies: [],
							users: {},
						})
					);
					dispatch(closeCreateNewCollectionWindow());
					alert('Successful created');
					router.push(`/collections/${collection.collectionId}`);
				}
			} catch (err) {
				console.log(err);
				alert('Unsuccessful');
			}
		}
	};

	return (
		<div className={styles.centeredBox}>
			<div className={styles.name}>
				Collection name: &nbsp;
				<input
					type="text"
					onChange={(event) => {
						setCollectionInfo({
							...collectionInfo,
							collectionName: event.target.value,
						});
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							uploadHandler();
						}
					}}
				></input>
			</div>
			<div className={styles.visibility}>
				Visibility: &nbsp;
				<select
					value={collectionInfo.private ? 'private' : 'public'}
					onChange={(event) => {
						setCollectionInfo({
							...collectionInfo,
							private: event.target.value === 'private',
						});
					}}
				>
					<option value="private">Private</option>
					<option value="public">Public</option>
				</select>
			</div>
			<div className={styles.buttonContainer}>
				<button className={styles.createBtn} onClick={uploadHandler}>
					Create
				</button>
			</div>
		</div>
	);
};

export default CreateNewCollection;
