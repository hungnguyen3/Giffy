import styles from '../styles/UploadGiffy.module.scss';
import {
	addGiffyToACollection,
	closeUploadGiffyWindow,
} from '../slices/CollectionsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';
import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { createCollection, createGiffy } from '../API/serverHooks';
import { storage } from './Firebase/FirebaseInit';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import FileUploadBox from './FileUploadBox';
import { giffyDTO } from '../API/DTO';

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
	const [collectionOptions, setCollectionOptions] = useState<any[]>([]);
	const userId = useAppSelector((state: RootState) => state.user.value?.userId);
	const collections = useAppSelector(
		(state: RootState) => state.collections.value
	);
	const [giffyInfo, setGiffyInfo] = useState<GiffyInfo>({
		collectionId: props.currentCollectionId,
		giffyName: '',
	});

	const findCurrentCollection = () => {
		var currentCollectionOptionIndex = 0;
		collectionOptions.filter((collectionOption, index) => {
			collectionOption.value == props.currentCollectionId.toString();
			currentCollectionOptionIndex = index;
		});
		return currentCollectionOptionIndex;
	};

	const setCollectionIdForGiffyInfo = (selectInput: any) => {
		setGiffyInfo({
			...giffyInfo,
			collectionId: Number(selectInput.value),
		});
	};

	const creatableSelectHandler = async (selectInput: any) => {
		if (!selectInput) return;
		if (Number.isNaN(Number(selectInput.value))) {
			const newCollection = await createCollection({
				collectionName: selectInput.label,
				private: true,
				userId: userId!,
			});

			if (!newCollection.collectionId) {
				alert('Could not create a new collection, please try again');
			} else {
				setCollectionOptions([
					...collectionOptions,
					{
						value: newCollection.collectionId.toString(),
						label: newCollection.collectionName,
					},
				]);
				selectInput.value = newCollection.collectionId;
				setCollectionIdForGiffyInfo(selectInput);
			}
		} else {
			setCollectionIdForGiffyInfo(selectInput);
		}
	};

	const uploadHandler = async () => {
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
					const createGiffyRes: giffyDTO = await createGiffy({
						collectionId: Number(giffyInfo.collectionId),
						firebaseUrl: downloadURL,
						giffyName: giffyInfo.giffyName,
					});

					console.log(createGiffyRes);
					if (createGiffyRes) {
						dispatch(addGiffyToACollection(createGiffyRes));
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
	};

	useEffect(() => {
		if (collections) {
			setCollectionOptions(
				collections.map(collection => {
					return {
						value: collection.collectionId.toString(),
						label: collection.collectionName,
					};
				})
			);
		}
	}, [collections]);

	return (
		<div>
			<CreatableSelect
				isClearable
				defaultValue={collectionOptions[findCurrentCollection()]}
				onChange={creatableSelectHandler}
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
				<button className={styles.fileUploadBtn} onClick={uploadHandler}>
					Upload
				</button>
			</div>
		</div>
	);
};

export default UploadGiffy;
