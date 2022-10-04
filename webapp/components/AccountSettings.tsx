import accountSettingsStyles from '../styles/AccountSettings.module.scss';
import { close as closeAccountSetting } from '../slices/AccountSettingSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';

const AccountSettings = () => {
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const dispatch = useAppDispatch();

	return (
		<div className={accountSettingsStyles.accountSettingsWindow}>
			<span
				className={accountSettingsStyles.closeIcon}
				onClick={() => {
					dispatch(closeAccountSetting());
				}}
			>
				x
			</span>
			{userAuth?.displayName}
		</div>
	);
};

export default AccountSettings;
