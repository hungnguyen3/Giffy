import styles from '../styles/Layout.module.scss';
import SideNav from './SideNav';
import Header from './Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '../slices/UserAuthSlice';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const auth = getAuth();
	const dispatch = useDispatch();

	onAuthStateChanged(auth, user => {
		if (user) {
			const userAuth = {
				uid: user.uid,
				email: user.uid,
				displayName: user.uid,
				photoURL: user.uid,
			};
			dispatch(logIn(userAuth));
		} else {
			dispatch(logOut());
		}
	});

	return (
		<div className={styles.background}>
			<SideNav width={'20%'} />
			<div className={styles.flexView}>
				<Header />
				{props.children}
			</div>
		</div>
	);
};

export default Layout;
