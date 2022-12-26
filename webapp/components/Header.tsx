import styles from '../styles/Header.module.scss';
import { FcSearch } from 'react-icons/fc';
import { useEffect, useRef, useState } from 'react';
import { googleSignIn, logOut } from './Firebase/FirebaseInit';
import { VscAccount } from 'react-icons/vsc';
import { BiLogIn, BiLogOut } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import DropdownItem from './DropdownItem';
import { useAppDispatch, useAppSelector } from '../hooks';
import { open as openAccountSetting } from '../slices/AccountSettingSlice';
import { RootState } from '../store';
import Link from 'next/link';

const Header = () => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
	const dropdownBlockRef = useRef<HTMLInputElement | null>(null);
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const dispatch = useAppDispatch();

	// Track events outside scope
	const clickOutside = (event: TouchEvent | MouseEvent) => {
		if (dropdownBlockRef.current?.contains(event.target as Node)) {
			// inside click
			return;
		} else {
			// outside click
			setIsUserMenuOpen(false);
			// clean up function
			document.removeEventListener('mousedown', clickOutside);
		}
	};

	useEffect(() => {
		if (isUserMenuOpen) {
			// add listener when the menu is open
			document.addEventListener('mousedown', clickOutside);
		}
	}, [isUserMenuOpen]);

	return (
		<nav>
			<div className={styles.header}>
				<div className={styles.leftPart}>
					<div className={styles.mainTitle}>
						<Link href="/">
							<h1>Giffy</h1>
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

				<div
					className={styles.rightPart}
					onClick={() => {
						setIsUserMenuOpen(!isUserMenuOpen);
					}}
				>
					<div className={styles.dropdownContainer} ref={dropdownBlockRef}>
						<div className={styles.userButton}>
							<VscAccount />
						</div>
						{isUserMenuOpen ? (
							<div className={styles.dropdown}>
								<ul>
									{userAuth ? (
										<li onClick={logOut} className={styles.login}>
											<DropdownItem icon={BiLogOut} text={'Log out'} />
										</li>
									) : (
										<li onClick={googleSignIn} className={styles.login}>
											<DropdownItem icon={BiLogIn} text={'Log in'} />
										</li>
									)}
									<li
										onClick={() => {
											dispatch(openAccountSetting());
										}}
									>
										<DropdownItem icon={FiSettings} text={'Setting'} />
									</li>
								</ul>
							</div>
						) : (
							<div></div>
						)}
					</div>

					<div className={styles.userMenuTextContainer}>
						<ul className={styles.userMenuText}>
							<li className={styles.userID}>userID#721712817921727139</li>
							<li className={styles.secondaryText}>secondary text</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

// TODO: style userMenuText
// TODO: style userMenuText
// TODO: style userMenuText

export default Header;
