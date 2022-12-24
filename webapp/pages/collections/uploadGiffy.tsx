import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import FileUploadBox from '../../components/FileUploadBox';
import Layout from '../../components/Layout';
import styles from '../../styles/uploadGiffy.module.scss';
import { storage } from '../../components/Firebase/FirebaseInit';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collectionDTO } from '../../API/DTO';
import { createGiffy, getCollectionsByUserId } from '../../API/serverHooks';
import Select from 'react-select';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';

interface GiffyInfo {
	collectionId: number | null;
	giffyName: string;
}

const UploadGiffy: NextPage = () => {
	const [giffy, setGiffy] = useState<File | null>(null);
	const [collectionOptions, setCollectionOptions] = useState<any[]>([]);
	const userId = useAppSelector((state: RootState) => state.user.value?.userId);
	const [giffyInfo, setGiffyInfo] = useState<GiffyInfo>({
		collectionId: null,
		giffyName: '',
	});

	const setCollectionIdForGiffyInfo = (selectInput: any) => {
		setGiffyInfo({
			...giffyInfo,
			collectionId: Number(selectInput.value),
		});
	};

	useEffect(() => {
		if (userId) {
			getCollectionsByUserId(userId).then((collections: collectionDTO[]) => {
				setCollectionOptions(
					collections.map((collection: collectionDTO) => {
						return {
							value: collection.collectionId.toString(),
							label: collection.collectionName,
						};
					})
				);
			});
		}
	}, []);

	return (
		<Layout>
			<div className={styles.uploadGiffyBody}>
				<Select
					defaultValue={giffyInfo.collectionId}
					onChange={setCollectionIdForGiffyInfo}
					options={collectionOptions}
				/>

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
					<button
						className={styles.fileUploadBtn}
						onClick={async () => {
							if (!giffyInfo.collectionId) {
								alert('Choose a collection!');
							} else if (giffy) {
								try {
									const storageRef = ref(storage, `images/${giffy.name}`);
									const snapshot = await uploadBytes(storageRef, giffy);
									const downloadURL = await getDownloadURL(snapshot.ref);

									if (!downloadURL) {
										alert(
											'Failed to save image to firebase therefore failed to create a new giffy 1'
										);
									} else {
										const createGiffyRes = await createGiffy({
											collectionId: Number(giffyInfo.collectionId),
											firebaseUrl: downloadURL,
											giffyName: giffyInfo.giffyName,
										});

										if (createGiffyRes.status === 200) {
											alert('Upload successfully');
										} else {
											// TODO: error handling
										}
									}
								} catch (err) {
									console.log(err);
									alert('Upload unsuccessfully');
								}
							} else {
								alert('Select a file first');
							}
						}}
					>
						Upload
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default UploadGiffy;
