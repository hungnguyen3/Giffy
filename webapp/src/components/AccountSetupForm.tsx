import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { populateUser, setFinishedAccountSetup } from '../slices/UserSlice';
import { RootState } from '../store';
import styles from '../styles/Auth.module.scss';
import { UserDTO } from '../types/DTOs/UserDTOs';
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import FileUploadBox from './FileUploadBox';
import { signOut } from './Utilities/Cognito';
import UserService from '../API/UserService';

interface UserInfo {
	userName: string;
	profileImgUrl: string;
}

const AccountSetupForm = () => {
	const dispatch = useDispatch();
	const [userInfo, setUserInfo] = useState<UserInfo>({
		userName: '',
		profileImgUrl: 'https://raw.githubusercontent.com/hungnguyen3/Giffy/main/webapp/public/userProfile.png',
	});

	const [userImg, setUserImg] = useState<File | null>(null);

	const uploadHandler = async () => {
		if (userImg) {
			// TODO: Upload img to S3
			const createUserRes: ResponseMessage<UserDTO> = await UserService.createUser(userInfo.profileImgUrl);

			if (!isResponseMessageSuccess(createUserRes)) {
				alert('Upload unsuccessfully');
				// TODO: error handling
			} else {
				var user = createUserRes.data!;
				dispatch(
					populateUser({
						userId: user.userId,
						userName: user.userName,
						userEmail: user.userEmail,
						profileImgUrl: user.profileImgUrl,
					})
				);
				dispatch(setFinishedAccountSetup(true));
				alert('Created a new user successfully');
			}
		} else {
			alert('Select an img first');
		}
	};

	return (
		<div className={styles.centeredBox}>
			<h1>Account Setup 🚀</h1>
			<FileUploadBox
				setFileHolderForParent={setUserImg}
				displayText={'Drag and drop your profile img or click here'}
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
