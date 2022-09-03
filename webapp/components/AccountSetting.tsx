import styles from '../styles/AccountSetting.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { close as closeAccountSetting } from '../slices/AccountSettingSlice';

const AccountSetting = () => {
	// get userAuth to display some user information
	const userAuth = useSelector((state: RootState) => state.userAuth.value);

	return (
		<div className={styles.accountSettingWindow}>
			<div className={styles.accountSetting}>
				<span className={styles.closeIcon} onClick={closeAccountSetting}>
					x{/* TODO: close pop up window when x is clicked. */}
				</span>
				{userAuth?.displayName}
			</div>
		</div>
	);
};

export default AccountSetting;
