import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

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

	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className={styles.something}>
			<div className={styles.sideNav} style={{ width: width }}>
				<div>
					{isOpen ? (
						<button
							className={styles.btn}
							onClick={() => {
								closeNav();
								setIsOpen(false);
							}}
						>
							Collapse &nbsp;
							<AiOutlineArrowLeft></AiOutlineArrowLeft>
						</button>
					) : (
						<button
							className={styles.btn}
							onClick={() => {
								openNav();
								setIsOpen(true);
							}}
						>
							Open &nbsp;
							<AiOutlineArrowRight></AiOutlineArrowRight>
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
			<a>hello world</a>
		</div>
	);
};

export default SideNav;
