import styles from '../styles/AccountSetting.module.scss';
import { close as closeAccountSetting } from '../slices/AccountSettingSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';

const AccountSettings = () => {
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const dispatch = useAppDispatch();

	return (
		<div className={styles.accountSettingWindow}>
			<div className={styles.accountSetting}>
				<span
					className={styles.closeIcon}
					onClick={() => {
						dispatch(closeAccountSetting());
					}}
				>
					x
				</span>
				{userAuth?.displayName}
			</div>
		</div>
	);
};

export default AccountSettings;
