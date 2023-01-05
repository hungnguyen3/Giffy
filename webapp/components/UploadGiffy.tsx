import styles from '../styles/UploadGiffy.module.scss';
import { addGiffyToACollection } from '../slices/CollectionsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useState } from 'react';
import { createGiffy } from '../API/serverHooks';
import { storage } from './Firebase/FirebaseInit';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import FileUploadBox from './FileUploadBox';
import { giffyDTO } from '../API/DTO';
import { RootState } from '../store';

interface GiffyInfo {
	collectionId: number | null;
	giffyName: string;
}

interface UploadGiffyProps {
	currentCollectionId: number;
}

const UploadGiffy = (props: UploadGiffyProps) => {
	const dispatch = useAppDispatch();
	const [giffy, setGiffy] = useState<File | null>(null);
	const [giffyInfo, setGiffyInfo] = useState<GiffyInfo>({
		collectionId: props.currentCollectionId,
		giffyName: '',
	});
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);

	const uploadHandler = async () => {
		if (giffy) {
			try {
				const giffyFirebaseRef = `giffies/${userAuth?.email}/${
					giffy.name
				}${new Date().getTime()}`;
				const storageRef = ref(storage, giffyFirebaseRef);
				const snapshot = await uploadBytes(storageRef, giffy);
				const downloadURL = await getDownloadURL(snapshot.ref);

				if (!downloadURL) {
					alert(
						'Failed to save image to firebase therefore failed to create a new giffy 1'
					);
				} else {
					const createGiffyRes: giffyDTO | any = await createGiffy({
						collectionId: Number(giffyInfo.collectionId),
						firebaseUrl: downloadURL,
						firebaseRef: giffyFirebaseRef,
						giffyName: giffyInfo.giffyName,
					});

					if (createGiffyRes.error) {
						// TODO: error handling
					} else {
						dispatch(addGiffyToACollection(createGiffyRes));
						alert('Upload successfully');
					}
				}
			} catch (err) {
				console.log(err);
				alert('Upload unsuccessfully');
			}
		} else {
			alert('Select a file first');
		}
	};

	return (
		<div className={styles.centeredBox}>
			<div className={styles.name}>
				Giffy name (Optional): &nbsp;
				<input
					type="text"
					onChange={event => {
						setGiffyInfo({
							...giffyInfo,
							giffyName: event.target.value,
						});
					}}
				></input>
			</div>
			<FileUploadBox
				setFileHolderForParent={setGiffy}
				displayText={'Drag and drop an img/gif or click here'}
			/>
			<div className={styles.buttonContainer}>
				<button className={styles.createBtn} onClick={uploadHandler}>
					Upload
				</button>
			</div>
		</div>
	);
};

export default UploadGiffy;
