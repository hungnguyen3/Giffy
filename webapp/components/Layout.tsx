import layoutStyles from '../styles/Layout.module.scss';
import SidePanel from './SidePanel';
import Header from './Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect, useState } from 'react';
import { RootState } from '../store';
import AccountSettings from './AccountSettings';
import { app } from './Firebase/FirebaseInit';
import { logIn, logOut } from '../slices/UserAuthSlice';
import {
	getCollectionsByUserId,
	getGiffiesByCollectionId,
	getUserByFirebaseAuthId,
} from '../API/serverHooks';
import { clearUser, populateUser } from '../slices/UserSlice';
import { collectionDTO, giffyDTO } from '../API/DTO';
import {
	clearCollections,
	Collection,
	populateCollections,
} from '../slices/CollectionsSlice';

interface LayoutProps {
	children: (JSX.Element | null)[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const auth = getAuth(app);
	const [loggedIn, setLoggedIn] = useState(false);
	const dispatch = useAppDispatch();
	const isAccountSettingOpen = useAppSelector(
		(state: RootState) => state.accountSetting.isAccountSettingOpen
	);

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const userAuth = {
					uid: user.uid,
					email: user.uid,
					displayName: user.uid,
					photoURL: user.uid,
				};

				getUserByFirebaseAuthId(userAuth.uid)
					.then(user => {
						const userInfo = {
							userId: user.userId,
							username: user.username,
							profileImgUrl: user.profileImgUrl,
						};

						dispatch(populateUser(userInfo));
						return userInfo;
					})
					.then(userInfo => {
						getCollectionsByUserId(userInfo.userId).then(
							(collections: collectionDTO[]) => {
								var toStoreCollections: Collection[] = [];

								collections.map((collection: collectionDTO) => {
									getGiffiesByCollectionId(
										Number(collection.collectionId)
									).then((giffies: giffyDTO[]) => {
										toStoreCollections = [
											...toStoreCollections,
											{
												collectionId: collection.collectionId,
												collectionName: collection.collectionName,
												private: collection.private,
												giffies: giffies,
											},
										];
										dispatch(populateCollections(toStoreCollections));
									});
								});
							}
						);
					});

				dispatch(logIn(userAuth));
				setLoggedIn(true);
			} else {
				dispatch(logOut());
				dispatch(clearUser());
				dispatch(clearCollections());
				setLoggedIn(false);
			}
		});
	}, []);

	return (
		<div className={layoutStyles.background}>
			{/* if change the value 20%, change the width of flexView class too*/}
			<SidePanel width={'20%'} />
			<div className={layoutStyles.flexView}>
				<Header />
				<div className={layoutStyles.pageContent}>
					{loggedIn ? props.children : <div>You're not signed in yet!</div>}
				</div>
			</div>
			{isAccountSettingOpen ? (
				<div className={layoutStyles.settingWindow}>
					<AccountSettings />
				</div>
			) : null}
		</div>
	);
};

export default Layout;
