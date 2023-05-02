import styles from '../styles/UploadGiffy.module.scss';
import { addGiffyToACollection } from '../slices/CollectionsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useState } from 'react';
import FileUploadBox from './FileUploadBox';
import { RootState } from '../store';
import { createGiffy } from '../API/giffyHooks';
import { CreateGiffyDTO, isCreateGiffyDTO } from '../API/types/giffies-types';
import { ErrorDTO } from '../API/types/errors-types';

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

	const uploadHandler = async () => {
		// TODO: upload image to AWS
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
					onKeyDown={event => {
						if (event.key === 'Enter') {
							uploadHandler();
						}
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
