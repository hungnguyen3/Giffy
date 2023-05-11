import styles from '../styles/CreateNewCollection.module.scss';
import { addNewCollection, closeCreateNewCollectionWindow } from '../slices/CollectionsSlice';
import { useAppDispatch } from '../hooks';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import CollectionService from '../API/CollectionService';
import { CollectionDTO } from '../types/DTOs/CollectionDTOs';

interface CollectionInfo {
	collectionName: string;
	isPrivate: boolean;
	// TODO: add list of shared users, auto clear(?) if private is true
}

const CreateNewCollection = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
		collectionName: '',
		isPrivate: false,
	});

	const uploadHandler = async () => {
		if (collectionInfo.collectionName == '') {
			alert('Please fill in collection name');
		} else {
			try {
				const createCollectionRes: ResponseMessage<CollectionDTO> = await CollectionService.createCollection({
					collectionName: collectionInfo.collectionName,
					isPrivate: collectionInfo.isPrivate,
				});

				if (!isResponseMessageSuccess(createCollectionRes)) {
					alert(createCollectionRes.message);
				} else {
					var collection = createCollectionRes.data!;

					dispatch(
						addNewCollection({
							collectionId: collection.collectionId,
							collectionName: collection.collectionName,
							isPrivate: collection.isPrivate,
							giffies: [],
							users: {},
						})
					);
					dispatch(closeCreateNewCollectionWindow());
					alert(createCollectionRes.message);
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
					value={collectionInfo.isPrivate ? 'private' : 'public'}
					onChange={(event) => {
						setCollectionInfo({
							...collectionInfo,
							isPrivate: event.target.value === 'private',
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
