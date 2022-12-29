import styles from '../styles/Header.module.scss';
import { useEffect, useRef, useState } from 'react';
import { googleSignIn, logOut } from './Firebase/FirebaseInit';
import { VscAccount } from 'react-icons/vsc';
import { BiLogIn, BiLogOut } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import DropdownItem from './DropdownItem';
import { useAppDispatch, useAppSelector } from '../hooks';
import { open as openAccountSetting } from '../slices/AccountSettingSlice';
import { RootState } from '../store';
import { useRouter } from 'next/router';

const Header = () => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
	const dropdownBlockRef = useRef<HTMLInputElement | null>(null);
	const userAuth = useAppSelector((state: RootState) => state.userAuth.value);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { collection } = router.query;
	const curCollectionName = useAppSelector((state: RootState) => {
		return state.collections.value?.filter(
			curCollection => curCollection.collectionId === Number(collection)
		)[0]?.collectionName;
	});
	const userInfo = useAppSelector((state: RootState) => state.user.value);

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
						<h1>{curCollectionName}</h1>
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
							{userInfo?.profileImgUrl ? (
								<div className={styles.userImg}>
									<img src={userInfo.profileImgUrl} />
								</div>
							) : (
								<VscAccount />
							)}
						</div>
						{isUserMenuOpen ? (
							<div className={styles.dropdown}>
								<ul>
									<li onClick={logOut} className={styles.login}>
										<DropdownItem icon={BiLogOut} text={'Log out'} />
									</li>
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
							<li className={styles.userName}>{userInfo?.username}</li>
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
