import styles from '../styles/CreateNewCollection.module.scss';
import { addNewCollection } from '../slices/CollectionsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useState } from 'react';
import { createCollection } from '../API/serverHooks';
import { RootState } from '../store';

interface CollectionInfo {
	collectionName: string;
	private: boolean;
}

const CreateNewCollection = () => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector((state: RootState) => state.user.value?.userId);
	const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
		collectionName: '',
		private: true,
	});

	const uploadHandler = async () => {
		if (collectionInfo.collectionName == '') {
			alert('Please fill in collection name');
		} else if (!userId) {
			alert("Something went wrong while loading user's info");
		} else {
			try {
				const collection = await createCollection({
					collectionName: collectionInfo.collectionName,
					private: collectionInfo.private,
					userId: userId,
				});

				if (collection.error) {
					alert('Something went wrong trying to create a new collection');
				} else {
					dispatch(
						addNewCollection({
							collectionId: collection.collectionId,
							collectionName: collection.collectionName,
							private: collection.private,
							giffies: [],
						})
					);
					alert('Successful created');
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
					onChange={event => {
						setCollectionInfo({
							...collectionInfo,
							collectionName: event.target.value,
						});
					}}
				></input>
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
