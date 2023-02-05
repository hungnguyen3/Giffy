import { useState } from 'react';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';
import styles from '../styles/AccountSettings.module.scss';

const AccountSettings = () => {
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const [prevewImage, setPrevewImage] = useState<string>(
		userAuth?.photoURL as string
	);
	const [userName, setUserName] = useState<string>(
		userAuth?.displayName as string
	);
	const [isImgUploadSubmitDisabled, setIsImgUploadSubmitDisabled] =
		useState<boolean>(true);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleSubmit = () => {
		console.log('handle this');
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
												const file = event.target.files[0];
												setSelectedFile(file);
												setIsImgUploadSubmitDisabled(true);
											} else setSelectedFile(null);
										}}
									/>
									<img src={prevewImage} className={styles.userProfileImg} />
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
											event.target.value === userAuth?.displayName &&
											selectedFile === null
										) {
											setIsImgUploadSubmitDisabled(true);
										} else {
											setUserName(event.target.value);
											setIsImgUploadSubmitDisabled(false);
										}
									}}
									onKeyDown={event => {
										if (event.key === 'Enter') {
											handleSubmit();
										}
									}}
								></input>
							</div>
							<div>
								<div className={styles.userInfo}>
									<p>email: </p>
									<p className={styles.userEmail}>{userAuth?.email}</p>
								</div>
							</div>
						</div>

						<div className={styles.formSubmit}>
							<button
								className={styles.imgUploadSubmit}
								type="submit"
								onClick={() => {}}
								disabled={isImgUploadSubmitDisabled}
								style={
									isImgUploadSubmitDisabled
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
