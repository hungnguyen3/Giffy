import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import FileUploadBox from '../../components/FileUploadBox';
import Layout from '../../components/Layout';
import styles from '../../styles/uploadGiffy.module.scss';
import { storage } from '../../components/Firebase/FirebaseInit';
import { ref, uploadBytes } from 'firebase/storage';
import { collectionDTO } from '../../API/DTO';
import { getCollectionsByUserId } from '../../API/serverHooks';
import Select from 'react-select';

interface GiffyInfo {
	collectionId: number | null;
	giffyName: string | null;
	giffy: string | null;
}

const UploadGiffy: NextPage = () => {
	const [giffy, setGiffy] = useState<File | null>(null);
	const [collectionOptions, setCollectionOptions] = useState<any[]>([]);
	const [giffyInfo, setGiffyInfo] = useState<GiffyInfo>({
		collectionId: null,
		giffyName: null,
		giffy: null,
	});

	const setCollectionIdForGiffyInfo = (selectInput: any) => {
		setGiffyInfo({
			...giffyInfo,
			collectionId: Number(selectInput.value),
		});
	};

	useEffect(() => {
		getCollectionsByUserId(
			`${
				process.env.NEXT_PUBLIC_SERVER_URL
			}/collections/getCollectionsByUserId/${3}`
		).then((collections: collectionDTO[]) => {
			setCollectionOptions(
				collections.map((collection: collectionDTO) => {
					return {
						value: collection.collectionId.toString(),
						label: collection.collectionName,
					};
				})
			);
		});
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
				<FileUploadBox setFileHolderForParent={setGiffy} />
				<div className={styles.buttonContainer}>
					<button
						className={styles.fileUploadBtn}
						onClick={() => {
							if (giffy) {
								const storageRef = ref(storage, `images/${giffy.name}`);

								uploadBytes(storageRef, giffy)
									.then(snapshot => {
										console.log(snapshot);
										alert('Upload successfully.');
									})
									.catch(() => {
										alert('Upload Failed.');
									});
							} else {
								alert('Select a file first.');
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
