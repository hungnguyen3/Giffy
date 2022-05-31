import styles from '../styles/Layout.module.scss';
import SideNav from './SideNav';
import Header from './Header';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
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
