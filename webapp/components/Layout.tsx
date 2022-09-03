import styles from '../styles/Layout.module.scss';
import SideNav from './SideNav';
import Header from './Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, logOut } from '../slices/UserAuthSlice';
import { useState } from 'react';
import { RootState } from '../store';
import AccountSetting from './AccountSetting';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const auth = getAuth();
	const dispatch = useDispatch();
	const [loggedIn, setLoggedIn] = useState(false);
	const isAccountSettingOpen = useSelector(
		(state: RootState) => state.accountSetting.isAccountSettingOpen
	);

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

	return (
		<div className={styles.background}>
			<SideNav width={'20%'} />
			<div className={styles.flexView}>
				<Header />
				{loggedIn ? props.children : <div>You're not signed in yet!</div>}
			</div>
			{isAccountSettingOpen ? (
				<div className={styles.settingWindow}>
					<AccountSetting />
				</div>
			) : null}
		</div>
	);
};

export default Layout;
