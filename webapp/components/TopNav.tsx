import styles from '../styles/TopNav.module.scss';
import { FcSearch } from 'react-icons/fc';
import Link from 'next/link';

const TopNav = () => {
	return (
		<nav>
			<div className={styles.TopNav}>
				<div className={styles.leftPart}>
					<div className={styles.mainTitle}>
						<Link href="/">
							<h1>Giffy</h1>
						</Link>
					</div>

					<div className={styles.searchContainer}>
						<form action="/action_page.php">
							<input type="text" placeholder="Search.." name="search" />
							<button type="submit">
								<FcSearch></FcSearch>
							</button>
						</form>
					</div>
				</div>
				<div className={styles.menuContainer}>
					<button type="button" className={styles.userButton}>
						☰
					</button>
					<div className={styles.dropdown}>
						<ul>
							<li>Option 1</li>
							<li>Option 2</li>
							<li>Option 3</li>
							<li>Option 4</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default TopNav;
