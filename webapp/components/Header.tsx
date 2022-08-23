import styles from '../styles/TopNav.module.scss';
import { FcSearch } from 'react-icons/fc';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { googleSignIn, logOut } from './Firebase/FirebaseInit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Header = () => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const userAuth = useSelector((state: RootState) => state.userAuth.value);

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
							setIsUserMenuOpen(!isUserMenuOpen);
						}}
					>
						<FiUser />
					</button>
					{isUserMenuOpen ? (
						<div className={styles.dropdown}>
							<ul>
								{userAuth ? (
									<button onClick={logOut}>Log out</button>
								) : (
									<button onClick={googleSignIn}>Login</button>
								)}
								<li>Settings</li>
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

export default Header;
