import styles from '../styles/TopNav.module.scss';
import { FcSearch } from 'react-icons/fc';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

const TopNav = () => {
	const [open, setOpen] = useState(false);
	return (
		<nav>
			<div className={styles.TopNav}>
				<div className={styles.leftPart}>
					<div className={styles.mainTitle}>
						<Link href="/">
							<a>
								<h1>Giffy</h1>
							</a>
						</Link>
					</div>

					<div className={styles.searchContainer}>
						<form action="/action_page.php">
							<input type="text" placeholder="Search.." name="search" />
							<button type="submit" className={styles.button}>
								<FcSearch></FcSearch>
							</button>
						</form>
					</div>
				</div>
				<div className={styles.menuContainer}>
					<button
						type="button"
						className={styles.userButton}
						onClick={() => {
							setOpen(!open);
						}}
					>
						<FiUser />
					</button>
					{open ? (
						<div className={styles.dropdown}>
							<ul>
								<li>Option 1</li>
								<li>Option 2</li>
								<li>Option 3</li>
								<li>Option 4</li>
							</ul>
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default TopNav;
