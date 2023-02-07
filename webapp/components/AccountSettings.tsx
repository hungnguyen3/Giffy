import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ErrorDTO } from '../API/types/errors-types';
import { isUserDTO, UpdateUserByIdDTO } from '../API/types/users-types';
import { updateUser } from '../API/userHooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import { populateUser } from '../slices/UserSlice';
import { RootState } from '../store';
import styles from '../styles/AccountSettings.module.scss';
import { storage } from './Firebase/FirebaseInit';

const AccountSettings = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user?.value);
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [prevewImageUrl, setPrevewImageUrl] = useState<string | null>(null);
	const [userName, setUserName] = useState<string>(user?.userName as string);
	const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
		useState<boolean>(true);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleSubmit = () => {
		console.log('handle this');
	};

	const handleImageChange = (file: File) => {
		if (!file) return;

		setProfileImage(file);
		setIsSaveButtonDisabled(false);

		const reader = new FileReader();
		reader.onloadend = () => {
			setPrevewImageUrl(reader.result as string);
		};
		reader.readAsDataURL(file!);
	};

	const handleSave = async () => {
		if (isSaveButtonDisabled) return;

		setIsSaving(true);

		if (profileImage) {
			// if profile picture is updated, update it along with name in firebase and database
			try {
				const imageFirebaseRef = `/userProfilePics/${userAuth?.email}`;
				const profileImageStorageRef = ref(storage, imageFirebaseRef);
				const snapshot = await uploadBytes(
					profileImageStorageRef,
					profileImage
				);
				const downloadURL = await getDownloadURL(snapshot.ref);

				if (!downloadURL) {
					alert('Failed to save image to firebase');
				} else {
					const updateUserRes: UpdateUserByIdDTO | ErrorDTO = await updateUser({
						userId: user?.userId as number,
						userName: userName,
						profileImgUrl: downloadURL,
					});

					if (!isUserDTO(updateUserRes)) {
						alert('Something went wrong saving new profile picture!');
					} else {
						dispatch(
							populateUser({
								userId: updateUserRes.userId,
								userName: updateUserRes.userName,
								profileImgUrl: updateUserRes.profileImgUrl,
							})
						);
						alert('Upload successfully');
					}
				}
			} catch (error) {
				alert('Upload unsuccessfully');
			} finally {
				setIsSaving(false);
			}
		} else {
			if (userName != user?.userName) {
				// if name is updated, update name in database
				const updateUserRes: UpdateUserByIdDTO | ErrorDTO = await updateUser({
					userId: user?.userId as number,
					userName: userName,
					profileImgUrl: user?.profileImgUrl as string,
				});

				if (!isUserDTO(updateUserRes)) {
					alert('Something went wrong updating username!');
				} else {
					dispatch(
						populateUser({
							userId: updateUserRes.userId,
							userName: updateUserRes.userName,
							profileImgUrl: updateUserRes.profileImgUrl,
						})
					);
					alert('Upload successfully');
				}
			}
			setIsSaving(false);
		}
	};

	return (
		<div className={styles.centeredBox}>
			<div className={styles.settingsContainer}>
				{/* credits: https://codepen.io/priyaa-sharma/pen/MWKgjyz */}
				<h1 className={styles.pageTitle}>Account Settings</h1>
				<div className={styles.settingsSection}>
					<h2 className={styles.settingsTitle}>My profile</h2>
					<form className={styles.profileForm}>
						<div className={styles.imgUploadContainer}>
							<h4 style={{ paddingRight: '37px', marginTop: '-17px' }}>
								Change Your Profile Picture
							</h4>
							<label className={styles.imgUpload}>
								<div className={styles.imgUploadBox}>
									<input
										type="file"
										accept="image/*"
										value=""
										className={styles.imgUploadInput}
										onChange={event => {
											if (event.target.files) {
												handleImageChange(event.target.files?.[0]);
											} else setSelectedFile(null);
										}}
									/>
									<img
										src={
											prevewImageUrl === null
												? user?.profileImgUrl
												: prevewImageUrl
										}
										className={styles.userProfileImg}
										alt={'Preview'}
									/>
									<span className={styles.changeImgText}>Change Image</span>
								</div>
							</label>
						</div>

						<div className={styles.settingsSection}>
							<h2 className={styles.settingsTitle}>General Information</h2>
							<div className={styles.userInfo}>
								<p>username:</p>
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
									onKeyDown={event => {
										if (event.key === 'Enter') {
											handleSubmit();
										}
									}}
								></input>
							</div>
						</div>

						<div className={styles.formSubmit}>
							<button
								className={styles.imgUploadSubmit}
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
			</div>
		</div>
	);
};

export default AccountSettings;
