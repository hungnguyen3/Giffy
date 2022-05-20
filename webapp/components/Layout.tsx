import styles from '../styles/Layout.module.scss';
import SideNav from './SideNav';

interface LayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	return (
		<div className={styles.background}>
			<SideNav width={'20%'} />
			{props.children}
		</div>
	);
};

export default Layout;
