import styles from '../styles/Header.module.scss';
import { useEffect, useRef, useState } from 'react';
import { VscAccount } from 'react-icons/vsc';
import { BiEditAlt, BiLogOut } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import DropdownItem from './DropdownItem';
import { useAppDispatch, useAppSelector } from '../hooks';
import { open as openAccountSetting } from '../slices/AccountSettingSlice';
import { RootState } from '../store';
import { useRouter } from 'next/router';
import { openCollectionSettingWindow } from '../slices/CollectionsSlice';
import { signOut } from './Utilities/Cognito';

const Header = () => {
	const router = useRouter();
	const { collectionId } = router.query;
	const dispatch = useAppDispatch();
	const dropdownBlockRef = useRef<HTMLInputElement | null>(null);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
	const curCollectionName = useAppSelector((state: RootState) => {
		if (Object.keys(state.collections.value).length !== 0) {
			if (Number(collectionId) in state.collections.value) {
				return state.collections.value[Number(collectionId)].collectionName;
			}
		}
	});
	const userInfo = useAppSelector((state: RootState) => state.user.value);
	const path = router.pathname.split('/')[1];
	const isOnDiscoveryPage = path == 'discovery';

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
					{!isOnDiscoveryPage && Number(collectionId) !== 0 && (
						<div
							className={styles.collectionSettingBtn}
							tabIndex={0}
							onClick={() => dispatch(openCollectionSettingWindow())}
						>
							<BiEditAlt />
						</div>
					)}
				</div>

				<div
					className={styles.rightPart}
					onClick={() => {
						setIsUserMenuOpen(!isUserMenuOpen);
					}}
				>
					<div className={styles.dropdownContainer} ref={dropdownBlockRef}>
						<div className={styles.userButton}>
							{userInfo?.profileImgS3Url ? <img src={userInfo.profileImgS3Url} /> : <VscAccount />}
						</div>
						{isUserMenuOpen ? (
							<div className={styles.dropdown}>
								<ul>
									{!userInfo ? (
										<li className={styles.login}>
											<DropdownItem icon={BiLogOut} text={'Log in'} />
										</li>
									) : (
										<li
											onClick={() => {
												signOut();
											}}
											className={styles.login}
										>
											<DropdownItem icon={BiLogOut} text={'Log out'} />
										</li>
									)}
									{userInfo && (
										<li
											onClick={() => {
												dispatch(openAccountSetting());
											}}
										>
											<DropdownItem icon={FiSettings} text={'Setting'} />
										</li>
									)}
								</ul>
							</div>
						) : (
							<div></div>
						)}
					</div>

					<div className={styles.userMenuTextContainer}>
						<ul className={styles.userMenuText}>
							<b className={styles.userName}>{userInfo?.userName}</b>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Header;
