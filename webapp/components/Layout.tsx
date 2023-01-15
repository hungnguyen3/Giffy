import layoutStyles from '../styles/Layout.module.scss';
import SidePanel from './SidePanel';
import Header from './Header';
import { getAuth } from 'firebase/auth';
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
import { collectionDTO } from '../API/types/collections-types';
import { giffyDTO } from '../API/types/giffies-types';
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
import { onCollectionsRoutePopulation } from './StorePopulationHelpers/onCollectionsRoutePopulation';

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
	const collections = useAppSelector(
		(state: RootState) => state.collections.value
	);

	useEffect(() => {
		onCollectionsRoutePopulation({
			dispatch: dispatch,
			router: router,
			setLoggedIn: setLoggedIn,
		});
	}, [hasAnAccount]); // rerun the entire flow again after account creation

	// handling collection deletion
	useEffect(() => {
		var collectionIds = collections.map(
			(collection: Collection) => collection.collectionId
		);

		if (
			!collectionIds.includes(Number(collectionId)) &&
			!router.route.includes('discovery')
		) {
			const minId = collectionIds.length > 0 ? Math.min(...collectionIds) : 0;
			router.push(`/collections/${minId}`);
		}
	}, [collections.length]);

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
