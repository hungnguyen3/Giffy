import styles from '../styles/Layout.module.scss';
import SideNav from './SideNav';
import Header from './Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect, useState } from 'react';
import { RootState } from '../store';
import AccountSettings from './AccountSettings';
import { app } from './Firebase/FirebaseInit';
import { logIn, logOut } from '../slices/UserAuthSlice';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const auth = getAuth(app);
	const [loggedIn, setLoggedIn] = useState(false);
	const dispatch = useAppDispatch();
	const isAccountSettingOpen = useAppSelector(
		(state: RootState) => state.accountSetting.isAccountSettingOpen
	);

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const userAuth = {
					uid: user.uid,
					email: user.uid,
					displayName: user.uid,
					photoURL: user.uid,
				};
				dispatch(logIn(userAuth));
				setLoggedIn(true);
			} else {
				dispatch(logOut());
				setLoggedIn(false);
			}
		});
	}, []);

	return (
		<div className={styles.background}>
			<SideNav width={'20%'} />
			<div className={styles.flexView}>
				<Header />
				{loggedIn ? props.children : <div>You're not signed in yet!</div>}
			</div>
			{isAccountSettingOpen ? (
				<div className={styles.settingWindow}>
					<AccountSettings />
				</div>
			) : null}
		</div>
	);
};

export default Layout;
