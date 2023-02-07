import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ErrorDTO } from '../API/types/errors-types';
import {
	isUpdateUserByIdDTO,
	isUserDTO,
	UpdateUserByIdDTO,
} from '../API/types/users-types';
import { updateUser } from '../API/userHooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import { populateUser } from '../slices/UserSlice';
import { RootState } from '../store';
import styles from '../styles/AccountSettings.module.scss';
import { storage } from './Firebase/FirebaseInit';
import { FaCameraRetro } from 'react-icons/fa';

const AccountSettings = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user?.value);
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
	const [userName, setUserName] = useState<string>(user?.userName as string);
	const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
		useState<boolean>(true);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleImageChange = (file: File) => {
		if (!file) return;

		setProfileImage(file);
		setIsSaveButtonDisabled(false);

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewImageUrl(reader.result as string);
		};
		reader.readAsDataURL(file!);
	};

	const uploadImage = async (profileImage: File) => {
		if (profileImage) {
			try {
				const imageFirebaseRef = `/userProfilePics/${userAuth?.email}`;
				const snapshot = await uploadBytes(
					ref(storage, imageFirebaseRef),
					profileImage
				);

				const downloadURL = await getDownloadURL(snapshot.ref);

				if (!downloadURL) {
					alert('Failed to save image to firebase');
				} else {
					return downloadURL;
				}
			} catch (error) {
				alert('Upload unsuccessfully');
				return null;
			}
		}

		return null;
	};

	const handleSave = async () => {
		if (isSaveButtonDisabled) return;
		if (!profileImage && userName === user?.userName) return; // return if no change

		// upload image to firebase
		const imgURL = await uploadImage(profileImage as File);

		// API call to backend
		const updateUserRes: UpdateUserByIdDTO | ErrorDTO = await updateUser({
			userId: user?.userId as number,
			userName: userName,
			profileImgUrl: imgURL ? imgURL : (user?.profileImgUrl as string),
		});

		// update user at the frontend
		if (!isUpdateUserByIdDTO(updateUserRes)) {
			alert('Something went wrong updating profile data!');
		} else {
			dispatch(
				populateUser({
					userId: updateUserRes.data.userId,
					userName: updateUserRes.data.userName,
					profileImgUrl: updateUserRes.data.profileImgUrl,
				})
			);
		}
	};

	return (
		<div className={styles.centeredBox}>
			<h1>Account Settings</h1>
			<form className={styles.profileSettingForm}>
				<div className={styles.profileImgContainer}>
					<h4 style={{ paddingRight: '37px', marginTop: '-17px' }}>
						Profile Picture:
					</h4>
					<div className={styles.profileImgBox}>
						<input
							type="file"
							accept="image/*"
							value=""
							onChange={event => {
								if (event.target.files) {
									handleImageChange(event.target.files?.[0]);
								} else setSelectedFile(null);
							}}
							className={styles.profileImgUploadInput}
						/>
						<img
							src={
								previewImageUrl === null ? user?.profileImgUrl : previewImageUrl
							}
							className={styles.profileImg}
							alt={'Preview'}
						/>
						<div className={styles.editIcon}>
							<FaCameraRetro size={25} />
						</div>
					</div>
				</div>

				<div className={styles.userInfo}>
					<h4>Profile Picture:</h4>
					<input
						type="text"
						value={userName}
						onChange={event => {
							setUserName(event.target.value);
							if (
								event.target.value === user?.userName &&
								selectedFile === null
							) {
								setIsSaveButtonDisabled(true);
							} else {
								setUserName(event.target.value);
								setIsSaveButtonDisabled(false);
							}
						}}
					></input>
				</div>

				<div className={styles.buttonContainer}>
					<button
						className={styles.saveBtn}
						type="submit"
						onClick={handleSave}
						disabled={isSaveButtonDisabled}
						style={
							isSaveButtonDisabled
								? {
										pointerEvents: 'none',
										backgroundColor: 'grey',
								  }
								: {}
						}
					>
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default AccountSettings;
