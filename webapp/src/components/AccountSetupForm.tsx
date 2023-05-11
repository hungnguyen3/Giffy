import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { populateUser, setFinishedAccountSetup } from '../slices/UserSlice';
import styles from '../styles/Auth.module.scss';
import { UserDTO } from '../types/DTOs/UserDTOs';
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import FileUploadBox from './FileUploadBox';
import { signOut } from './Utilities/Cognito';
import UserService from '../API/UserService';
import FileService from '../API/FileService';
import { S3UploadDTO } from '../types/DTOs/S3DTOs';

const AccountSetupForm = () => {
	const dispatch = useDispatch();

	const [userImg, setUserImg] = useState<File | null>(null);

	const uploadHandler = async () => {
		if (userImg) {
			// Upload the image to S3 using FileService
			const uploadRes: ResponseMessage<S3UploadDTO> = await FileService.uploadFile(userImg);

			if (!isResponseMessageSuccess(uploadRes)) {
				alert(uploadRes.message);
				// TODO: error handling
			} else {
				// Create a new user using UserService
				const createUserRes: ResponseMessage<UserDTO> = await UserService.createUser(
					uploadRes.data!.s3Url,
					uploadRes.data!.s3Key
				);

				if (!isResponseMessageSuccess(createUserRes)) {
					alert(createUserRes.message);
					// TODO: error handling
				} else {
					var user = createUserRes.data!;
					dispatch(
						populateUser({
							userId: user.userId,
							userName: user.userName,
							userEmail: user.userEmail,
							profileImgS3Url: user.profileImgS3Url,
							profileImgS3Key: user.profileImgS3Key,
						})
					);
					dispatch(setFinishedAccountSetup(true));
					alert('Created a new user successfully');
				}
			}
		} else {
			alert('Select an image first');
		}
	};

	return (
		<div className={styles.centeredBox}>
			<h1>Account Setup 🚀</h1>
			<FileUploadBox
				setFileHolderForParent={setUserImg}
				displayText={'Drag and drop your profile image or click here'}
			/>
			<div className={styles.buttonContainer}>
				<button className={styles.createBtn} onClick={uploadHandler}>
					Upload
				</button>
				<button className={styles.createBtn} onClick={signOut}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default AccountSetupForm;
