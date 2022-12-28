import { useAppSelector } from '../hooks';
import { RootState } from '../store';

const AccountSettings = () => {
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);

	return <div>{userAuth?.displayName}</div>;
};

export default AccountSettings;
