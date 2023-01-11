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
import UploadGiffy from '../components/UploadGiffy';
import { useRouter } from 'next/router';
import Modal from './Modal';
import Auth from './Auth';
import CreateNewCollection from './CreateNewCollection';
import { DeleteConfirmationWindow } from './DeleteConfirmationWindow';

interface LayoutProps {
	children: (JSX.Element | null)[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const auth = getAuth(app);
	const [loggedIn, setLoggedIn] = useState(false);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { collectionId } = router.query;
	const isAccountSettingOpen = useAppSelector(
		(state: RootState) => state.accountSetting.isAccountSettingOpen
	);
	const isUploadGiffyWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isUploadGiffyWindowOpen
	);
	const hasAnAccount = useAppSelector((state: RootState) =>
		state.user.value ? true : false
	);
	const isCreateNewCollectionWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isCreateNewCollectionWindowOpen
	);
	const isDeleteConfirmationWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isDeleteConfirmationWindowOpen
	);

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const userAuth = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL,
				};

				getUserByFirebaseAuthId(userAuth.uid)
					.then(user => {
						if (user.error) {
							return null;
						}
						const userInfo = {
							userId: user.userId,
							userName: user.userName,
							profileImgUrl: user.profileImgUrl,
						};

						if (userInfo.profileImgUrl && userInfo.userId && userInfo.userName)
							dispatch(populateUser(userInfo));
						return userInfo;
					})
					.then(userInfo => {
						if (!userInfo) {
							return null;
						}
						getCollectionsByUserId(userInfo.userId)
							.then((collections: collectionDTO[] | any) => {
								if (collections.error) {
									return null;
								}
								var toStoreCollections: Collection[] = [];

								collections.map((collection: collectionDTO) => {
									getGiffiesByCollectionId(
										Number(collection.collectionId)
									).then((giffies: giffyDTO[] | any) => {
										if (giffies.error) {
											return null;
										}
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

								const collectionIds = collections.map(
									(collection: collectionDTO) => collection.collectionId
								);

								return collectionIds.length > 0
									? Math.min(...collectionIds)
									: 0;
							})
							.then(firstCollectionId => {
								if (
									firstCollectionId !== null &&
									firstCollectionId !== undefined
								) {
									router.push(`/collections/${firstCollectionId}`);
								}
							});
					});

				dispatch(logIn(userAuth));
				setLoggedIn(true);
			} else {
				dispatch(logOut());
				dispatch(clearUser());
				dispatch(clearCollections());
				setLoggedIn(false);
				router.push('/auth');
			}
		});
	}, [hasAnAccount]); // rerun the entire flow again after account creation

	if (loggedIn && hasAnAccount)
		return (
			<div className={layoutStyles.background}>
				{/* if change the value 20%, change the width of flexView class too*/}
				<SidePanel width={'20%'} />
				<div className={layoutStyles.flexView}>
					<Header />
					<div className={layoutStyles.pageContent}>{props.children}</div>
				</div>
				{isAccountSettingOpen ? (
					<Modal disableCloseButton={false}>
						<AccountSettings />
					</Modal>
				) : null}
				{isUploadGiffyWindowOpen ? (
					<Modal disableCloseButton={false}>
						<UploadGiffy currentCollectionId={Number(collectionId)} />
					</Modal>
				) : null}
				{isCreateNewCollectionWindowOpen ? (
					<Modal disableCloseButton={false}>
						<CreateNewCollection />
					</Modal>
				) : null}
				{isDeleteConfirmationWindowOpen ? (
					<Modal disableCloseButton={false}>
						<DeleteConfirmationWindow />
					</Modal>
				) : null}
			</div>
		);

	return (
		<div>
			<Modal disableCloseButton={true}>
				<Auth />
			</Modal>
		</div>
	);
};

export default Layout;
