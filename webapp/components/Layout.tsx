import styles from '../styles/Layout.module.scss';
import SideNav from './sideNav';
import TopNav from './TopNav';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	return (
		<div className={styles.background}>
			<div className={styles.navBars}>
				<SideNav width={'20%'} />
				<TopNav />
			</div>
			{props.children}
		</div>
	);
};

export default Layout;
