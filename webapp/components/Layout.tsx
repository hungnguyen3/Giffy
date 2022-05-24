import styles from '../styles/Layout.module.scss';
import SideNav from './sideNav';
import TopNav from './TopNav';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	return (
		<div className={styles.background}>
			<SideNav width={'20%'} />
			<div className={styles.flexView}>
				<TopNav />
				{props.children}
			</div>
		</div>
	);
};

export default Layout;
