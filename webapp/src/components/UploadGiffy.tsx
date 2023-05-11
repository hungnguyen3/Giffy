import styles from '../styles/UploadGiffy.module.scss';
import { useAppDispatch } from '../hooks';
import { useState } from 'react';
import FileUploadBox from './FileUploadBox';
import FileService from '../API/FileService';
import { S3UploadDTO } from '../types/DTOs/S3DTOs';
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import GiffyService from '../API/GiffyService';
import { GiffyDTO } from '../types/DTOs/GiffyDTOs';
import { addGiffyToACollection } from '../slices/CollectionsSlice';

interface GiffyInfo {
	collectionId: number;
	giffyName: string;
}

interface UploadGiffyProps {
	currentCollectionId: number;
}

const UploadGiffy = (props: UploadGiffyProps) => {
	const dispatch = useAppDispatch();
	const [giffyFile, setGiffyFile] = useState<File | null>(null);
	const [giffyInfo, setGiffyInfo] = useState<GiffyInfo>({
		collectionId: props.currentCollectionId,
		giffyName: '',
	});

	const uploadHandler = async () => {
		if (giffyFile) {
			// Upload the gif to S3 using FileService
			const uploadRes: ResponseMessage<S3UploadDTO> = await FileService.uploadFile(giffyFile);

			if (!isResponseMessageSuccess(uploadRes)) {
				alert(uploadRes.message);
				// TODO: error handling
			} else {
				const data = {
					collectionId: giffyInfo.collectionId,
					giffyS3Url: uploadRes.data!.s3Url,
					giffyS3Key: uploadRes.data!.s3Key,
					giffyName: giffyInfo.giffyName,
				};

				// Create a new giffy using GiffyService
				const createGiffyRes: ResponseMessage<GiffyDTO> = await GiffyService.createGiffy(data);

				if (!isResponseMessageSuccess(createGiffyRes)) {
					alert(createGiffyRes.message);
					// TODO: error handling
				} else {
					var giffy = createGiffyRes.data!;
					dispatch(
						addGiffyToACollection({
							giffyId: giffy.giffyId,
							collectionId: giffy.collectionId,
							giffyName: giffy.giffyName,
							giffyS3Url: giffy.giffyS3Url,
							giffyS3Key: giffy.giffyS3Key,
						})
					);
					alert('Created a new giffy successfully');
				}
			}
		} else {
			alert('Select a gif first');
		}
	};

	return (
		<div className={styles.centeredBox}>
			<div className={styles.name}>
				Giffy name (Optional): &nbsp;
				<input
					type="text"
					onChange={(event) => {
						setGiffyInfo({
							...giffyInfo,
							giffyName: event.target.value,
						});
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							uploadHandler();
						}
					}}
				></input>
			</div>
			<FileUploadBox setFileHolderForParent={setGiffyFile} displayText={'Drag and drop a gif or click here'} />
			<div className={styles.buttonContainer}>
				<button className={styles.createBtn} onClick={uploadHandler}>
					Upload
				</button>
			</div>
		</div>
	);
};

export default UploadGiffy;
