import { useAppSelector } from '../hooks';
import { RootState } from '../store';
import styles from '../styles/AccountSettings.module.scss';

const AccountSettings = () => {
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);

	return (
		<div className={styles.centeredBox}>
			<div className={styles.settingsContainer}>
				{/* credits: https://codepen.io/priyaa-sharma/pen/MWKgjyz */}
				<h1 className={styles.pageTitle}>Account Settings</h1>
				<div className={styles.settingsSection}>
					<h2 className={styles.settingsTitle}>General Information</h2>
					<div className={styles.userInfo}>
						<p>username: big ass user</p>
					</div>
					<div>
						<div className={styles.userInfo}>
							<p>email: youissb@gmail.com</p>
							<p>email: youissb@gmail.com</p>
						</div>
					</div>
					<div>
						<div className={styles.userInfo}>
							<p></p>
						</div>
					</div>
				</div>
				<div className={styles.settingsSection}>
					<h2 className={styles.settingsTitle}>My profile</h2>
					<form className={styles.profileForm}>
						<div className={styles.imgUploadContainer}>
							<label className={styles.imgUpload}>
								<input
									type="file"
									accept=".jpg, .png, .jpeg, .gif"
									value=""
									className={styles.imgUploadInput}
								/>
							</label>
							<h4>Change Your Profile Picture</h4>
							<div className={styles.imgPreviewContainer}>
								<div className={styles.imgPreview}></div>
							</div>
						</div>
						<div className={styles.formSubmit}>
							<button className={styles.imgUploadSubmit} type="submit" disabled>
								Save New Picture
							</button>
						</div>
					</form>
				</div>
				<div className={styles.settingsSection}>
					<h2 className={styles.settingsTitle}>Password</h2>
					<form className={styles.form + ' ' + styles.myForm} />
					<div className={styles.formGroup}>
						<div className={styles.inputGroup}>
							<input
								name="currentPassword"
								placeholder="Old Password"
								type="password"
								className={styles.formControl}
								autoComplete="Old Password"
								value=""
							/>
							<span className={styles.focusInput}></span>
						</div>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="email" className={styles.label}>
							Email
						</label>
						<input
							type="email"
							id="email"
							className={styles.input}
							placeholder="Enter your email"
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="password" className={styles.label}>
							Password
						</label>
						<input
							type="password"
							id="password"
							className={styles.input}
							placeholder="Enter your password"
						/>
					</div>

					<div className={styles.formGroup}>
						<button type="submit" className={styles.button}>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountSettings;
