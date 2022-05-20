import styles from '../styles/SideNav.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';

interface SideNavProps {
	width: string;
}

const SideNav = (props: SideNavProps) => {
	const [width, setWidth] = useState(props.width);
	const closeNav = () => {
		setWidth('10%');
	};

	const openNav = () => {
		setWidth(props.width);
	};

	return (
		<div className={styles.sideNav} style={{ width: width }}>
			<div>
				{width >= props.width ? (
					<button
						className={styles.btn}
						onClick={() => {
							closeNav();
						}}
					>
						<BiLeftArrow></BiLeftArrow>
					</button>
				) : (
					<button
						className={styles.btn}
						onClick={() => {
							openNav();
						}}
					>
						<BiRightArrow></BiRightArrow>
					</button>
				)}
			</div>

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
