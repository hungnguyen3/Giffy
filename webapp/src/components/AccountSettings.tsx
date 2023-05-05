import { useState } from 'react';
import UserService from '../API/UserService';
import { useAppDispatch, useAppSelector } from '../hooks';
import { populateUser } from '../slices/UserSlice';
import { RootState } from '../store';
import styles from '../styles/AccountSettings.module.scss';
import { FaCameraRetro } from 'react-icons/fa';
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import { UserDTO } from '../types/DTOs/UserDTOs';

const AccountSettings = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user?.value);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
	const [userName, setUserName] = useState<string>(user?.userName as string);
	const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true);
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
		// TODO: upload image to AWS
		return null;
	};

	const handleSave = async () => {
		if (isSaveButtonDisabled) return;
		if (!profileImage && userName === user?.userName) return; // return if no change

		// TODO: upload image to AWS
		const imgURL = await uploadImage(profileImage as File);

		// API call to backend
		const updateUserRes: ResponseMessage<UserDTO> = await UserService.updateUser({
			userId: user?.userId as number,
			userName: userName,
			userEmail: user?.userEmail as string,
			profileImgUrl: imgURL ? imgURL : (user?.profileImgUrl as string),
		});

		// update user at the frontend
		if (!isResponseMessageSuccess(updateUserRes)) {
			alert(updateUserRes.message);
		} else {
			const updatedUser: UserDTO = updateUserRes.data!;
			dispatch(
				populateUser({
					userId: updatedUser.userId,
					userName: updatedUser.userName,
					userEmail: updatedUser.userEmail,
					profileImgUrl: updatedUser.profileImgUrl!,
				})
			);
		}
	};

	return (
		<div className={styles.centeredBox}>
			<h1>Account Settings</h1>
			<form className={styles.profileSettingForm}>
				<div className={styles.profileImgContainer}>
					<h4 style={{ paddingRight: '37px', marginTop: '-17px' }}>Profile Picture:</h4>
					<div className={styles.profileImgBox}>
						<input
							type="file"
							accept="image/*"
							value=""
							onChange={(event) => {
								if (event.target.files) {
									handleImageChange(event.target.files?.[0]);
								} else setSelectedFile(null);
							}}
							className={styles.profileImgUploadInput}
						/>
						<img
							src={previewImageUrl === null ? user?.profileImgUrl : previewImageUrl}
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
						onChange={(event) => {
							setUserName(event.target.value);
							if (event.target.value === user?.userName && selectedFile === null) {
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
