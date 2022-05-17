import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import { useState } from 'react';

interface SideNavProps {
	width: string;
}

const SideNav = (props: SideNavProps) => {
	const [width, setWidth] = useState(props.width);
	const closeNav = () => {
		setWidth('5%');
	};

	const openNav = () => {
		setWidth(props.width);
	};

	return (
		<div className={styles.sideNav} style={{ width: width }}>
			<button onClick={closeNav}>X</button>
			<button onClick={openNav}>O</button>
			<Link href="/collections">
				<a>Collections</a>
			</Link>
			<Link href="/discovery">
				<a>Discovery</a>
			</Link>
		</div>
	);
};

export default SideNav;
