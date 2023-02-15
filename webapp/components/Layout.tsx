import layoutStyles from '../styles/Layout.module.scss';
import SidePanel from './SidePanel';
import Header from './Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect, useState } from 'react';
import { RootState } from '../store';
import AccountSettings from './AccountSettings';
import { app } from './Firebase/FirebaseInit';
import { Collection } from '../slices/CollectionsSlice';
import UploadGiffy from '../components/UploadGiffy';
import { useRouter } from 'next/router';
import Modal from './Modal';
import Auth from './Auth';
import CreateNewCollection from './CreateNewCollection';
import { DeleteConfirmationWindow } from './DeleteConfirmationWindow';
import { onCollectionsRoutePopulation } from './StorePopulationHelpers/onCollectionsRoutePopulation';
import { CollectionSettingWindow } from './CollectionSettingWindow';
import { onDiscoveryRoutePopulation } from './StorePopulationHelpers/onDiscoveryRoutePopulation';

interface LayoutProps {
	children: (JSX.Element | null)[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { collectionId } = router.query;
	let path = router.pathname.split('/')[1];
	const isOnDiscoveryPage = path == 'discovery';
	const isOnCollectionsPage = path == 'collections';

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
	const isCollectionSettingWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isCollectionSettingWindowOpen
	);
	const collections = useAppSelector((state: RootState) =>
		Object.values(state.collections.value)
	);

	useEffect(() => {
		const handlePath = async () => {
			switch (path) {
				case '':
					router.push('/discovery/0');
				case 'discovery':
					await onDiscoveryRoutePopulation({
						dispatch: dispatch,
						router: router,
						setLoggedIn: setLoggedIn,
					});
					setLoading(false);
					break;
				case 'auth':
					// TO DO: add auth route population
					await onCollectionsRoutePopulation({
						dispatch: dispatch,
						router: router,
						setLoggedIn: setLoggedIn,
					});
					setLoading(false);
					break;
				default:
					await onCollectionsRoutePopulation({
						dispatch: dispatch,
						router: router,
						setLoggedIn: setLoggedIn,
					});
					setLoading(false);
					break;
			}
		};

		handlePath();
	}, [hasAnAccount, isOnCollectionsPage, isOnDiscoveryPage]); // rerun the entire flow

	// handling collection deletion
	useEffect(() => {
		var collectionIds = collections.map(
			(collection: Collection) => collection.collectionId
		);

		if (
			!collectionIds.includes(Number(collectionId)) &&
			(isOnCollectionsPage || isOnDiscoveryPage)
		) {
			const minId = collectionIds.length > 0 ? Math.min(...collectionIds) : 0;
			router.push(`/${path}/${minId}`);
		}
	}, [collections.length]);

	if (loading) {
		return <Loading />;
	} else if ((loggedIn && hasAnAccount) || isOnDiscoveryPage) {
		return (
			<div className={layoutStyles.background}>
				{/* if change the value 20%, change the width of flexView class too*/}
				<SidePanel width={'20%'} />
				<div className={layoutStyles.flexView}>
					<Header />
					<div className={layoutStyles.pageContent}>{props.children}</div>
				</div>
				{isAccountSettingOpen && (
					<Modal disableCloseButton={false}>
						<AccountSettings />
					</Modal>
				)}
				{isUploadGiffyWindowOpen && (
					<Modal disableCloseButton={false}>
						<UploadGiffy currentCollectionId={Number(collectionId)} />
					</Modal>
				)}
				{isCreateNewCollectionWindowOpen && (
					<Modal disableCloseButton={false}>
						<CreateNewCollection />
					</Modal>
				)}
				{isDeleteConfirmationWindowOpen && (
					<Modal disableCloseButton={false}>
						<DeleteConfirmationWindow />
					</Modal>
				)}
				{isCollectionSettingWindowOpen && (
					<Modal disableCloseButton={false}>
						<CollectionSettingWindow />
					</Modal>
				)}
			</div>
		);
	} else {
		return (
			<div>
				<Modal disableCloseButton={true}>
					<Auth />
				</Modal>
			</div>
		);
	}
};

const Loading = () => {
	return (
		<div
			className={layoutStyles.centeredBox}
			style={{ width: '100vw', height: '100vh' }}
		>
			<h3>Loading...</h3>
		</div>
	);
};

export default Layout;
