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
				<button
					className={styles.btn}
					onClick={() => {
						if (width >= props.width) {
							closeNav();
						} else {
							openNav();
						}
					}}
				>
					{width >= props.width ? <BiLeftArrow /> : <BiRightArrow />}
				</button>
			</div>

			<a href="/collections">Collections</a>

			<a href="/discovery">Discovery</a>
		</div>
	);
};

export default SideNav;
