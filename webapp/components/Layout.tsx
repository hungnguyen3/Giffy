import layoutStyles from '../styles/Layout.module.scss';
import SidePanel from './SidePanel';
import Header from './Header';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect, useState } from 'react';
import { RootState } from '../store';
import AccountSettings from './AccountSettings';
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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './Firebase/FirebaseInit';

interface LayoutProps {
	children: (JSX.Element | null)[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { collectionId } = router.query;
	let path = router.pathname.split('/')[1];
	const isOnDiscoveryPage = path == 'discovery';
	const isOnCollectionsPage = path == 'collections';
	const [establishingUserSessionDelay, setEstablishingUserSessionDelay] =
		useState(false);

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
		onAuthStateChanged(getAuth(app), user => {
			if (user) setEstablishingUserSessionDelay(true);
		});

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
					break;
				case 'auth':
					// TO DO: add auth route population
					await onCollectionsRoutePopulation({
						dispatch: dispatch,
						router: router,
						setLoggedIn: setLoggedIn,
					});
					break;
				default:
					await onCollectionsRoutePopulation({
						dispatch: dispatch,
						router: router,
						setLoggedIn: setLoggedIn,
					});
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

	// Because the user session is established asynchronously
	// We need to delay the rendering of the auth window
	useEffect(() => {
		const timer = setTimeout(() => {
			setEstablishingUserSessionDelay(false);
		}, 2000);
		return () => clearTimeout(timer);
	}, [establishingUserSessionDelay]);

	if ((loggedIn && hasAnAccount) || isOnDiscoveryPage) {
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
		if (!establishingUserSessionDelay) {
			return (
				<div>
					<Modal disableCloseButton={true}>
						<Auth />
					</Modal>
				</div>
			);
		} else {
			return <Loading />;
		}
	}
};

const Loading = () => {
	return (
		<div
			className={layoutStyles.centeredBox}
			style={{ width: '100vw', height: '100vh' }}
		>
			<h3>Loading...🚀🚀</h3>
		</div>
	);
};

export default Layout;
