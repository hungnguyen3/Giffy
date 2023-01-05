import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { userDTO } from '../API/DTO';
import { createUser } from '../API/serverHooks';
import { useAppSelector } from '../hooks';
import { populateUser } from '../slices/UserSlice';
import { RootState } from '../store';
import styles from '../styles/Auth.module.scss';
import FileUploadBox from './FileUploadBox';
import { googleSignIn, logOut, storage } from './Firebase/FirebaseInit';

interface UserInfo {
	userName: string;
	firebaseAuthId: string;
	profileImgUrl: string;
}

const Auth = () => {
	const dispatch = useDispatch();
	// TODO: firebaseAuthID might be null

	const [userInfo, setUserInfo] = useState<UserInfo>({
		userName: '',
		firebaseAuthId: '',
		profileImgUrl:
			'https://raw.githubusercontent.com/hungnguyen3/Giffy/main/webapp/public/userProfile.png',
	});
	const [userImg, setUserImg] = useState<File | null>(null);

	const firebaseAuthId = useAppSelector((state: RootState) =>
		state.userAuth.value ? state.userAuth.value.uid : ''
	);

	const isLoggedIn = useAppSelector((state: RootState) =>
		state.userAuth.value ? true : false
	);

	const hasAnAccount = useAppSelector((state: RootState) =>
		state.user.value ? true : false
	);

	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);

	useEffect(() => {
		setUserInfo({
			...userInfo,
			firebaseAuthId: firebaseAuthId,
		});
	}, [firebaseAuthId]);

	const uploadHandler = async () => {
		if (userImg) {
			try {
				const storageRef = ref(storage, `userProfilePics/${userAuth?.email}`);
				const snapshot = await uploadBytes(storageRef, userImg);
				const downloadURL = await getDownloadURL(snapshot.ref);

				if (!downloadURL) {
					alert(
						'Failed to save image to firebase therefore failed to create a new user'
					);
				} else {
					console.log({
						userName: userInfo.userName,
						firebaseAuthId: userInfo.firebaseAuthId,
						profileImgUrl: userInfo.profileImgUrl,
					});
					const createUserRes = await createUser({
						userName: userInfo.userName,
						firebaseAuthId: userInfo.firebaseAuthId,
						profileImgUrl: downloadURL,
					});

					if (createUserRes.error) {
						alert('Upload unsuccessfully');
						// TODO: error handling
					} else {
						dispatch(
							populateUser({
								userId: createUserRes.userId,
								userName: createUserRes.userName,
								profileImgUrl: createUserRes.profileImgUrl,
							})
						);
						alert('Created a new user successfully');
					}
				}
			} catch (err) {
				console.log(err);
				alert('Upload unsuccessfully');
			}
		} else {
			alert('Select an img first');
		}
	};

	if (isLoggedIn && !hasAnAccount) {
		return (
			<div className={styles.centeredBox}>
				<h1>Sign up 🚀</h1>
				<div className={styles.name}>
					User name: &nbsp;
					<input
						type="text"
						onChange={event => {
							setUserInfo({
								...userInfo,
								userName: event.target.value,
							});
						}}
					></input>
				</div>
				<FileUploadBox
					setFileHolderForParent={setUserImg}
					displayText={'Drag and drop your profile img or click here'}
				/>
				<div className={styles.buttonContainer}>
					<button className={styles.createBtn} onClick={uploadHandler}>
						Upload
					</button>
					<button className={styles.createBtn} onClick={logOut}>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.centeredBox}>
			<h1>Welcome to Giffy 👋</h1>
			<button onClick={googleSignIn} className={styles.loginWithGoogleBtn}>
				Sign in with Google
			</button>
		</div>
	);
};

export default Auth;
