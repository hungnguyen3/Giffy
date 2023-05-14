import layoutStyles from '../styles/Layout.module.scss';
import SidePanel from './SidePanel';
import Header from './Header';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useEffect } from 'react';
import { RootState } from '../store';
import AccountSettings from './AccountSettings';
import { Collection } from '../slices/CollectionsSlice';
import UploadGiffy from '../components/UploadGiffy';
import { useRouter } from 'next/router';
import Modal from './Modal';
import CreateNewCollection from './CreateNewCollection';
import { DeleteConfirmationWindow } from './DeleteConfirmationWindow';
import { onCollectionsRoutePopulation } from './StorePopulationHelpers/onCollectionsRoutePopulation';
import { CollectionSettingWindow } from './CollectionSettingWindow';
import { onDiscoveryRoutePopulation } from './StorePopulationHelpers/onDiscoveryRoutePopulation';
import AccountSetupForm from './AccountSetupForm';

interface LayoutProps {
	children: (JSX.Element | null)[] | JSX.Element;
}

const Layout = (props: LayoutProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { collectionId } = router.query;
	let path = router.pathname.split('/')[1];
	const isOnDiscoveryPage = path == 'discovery';
	const isOnCollectionsPage = path == 'collections';

	const isAccountSettingOpen = useAppSelector((state: RootState) => state.accountSetting.isAccountSettingOpen);
	const isUploadGiffyWindowOpen = useAppSelector((state: RootState) => state.collections.isUploadGiffyWindowOpen);
	const hasAnAccount = useAppSelector((state: RootState) => (state.user.finishedAccountSetup ? true : false));

	const isCreateNewCollectionWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isCreateNewCollectionWindowOpen
	);
	const isDeleteConfirmationWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isDeleteConfirmationWindowOpen
	);
	const isCollectionSettingWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isCollectionSettingWindowOpen
	);
	const collections = useAppSelector((state: RootState) => Object.values(state.collections.value));

	useEffect(() => {
		const handlePath = async () => {
			switch (path) {
				case '':
					router.push('/discovery/0');
				case 'discovery':
					onDiscoveryRoutePopulation({
						dispatch: dispatch,
						router: router,
					});
					break;
				case 'auth':
					onCollectionsRoutePopulation({
						dispatch: dispatch,
						router: router,
					});
					break;
				default:
					onCollectionsRoutePopulation({
						dispatch: dispatch,
						router: router,
					});
					break;
			}
		};

		handlePath();
	}, [hasAnAccount, isOnCollectionsPage, isOnDiscoveryPage]); // rerun the entire flow

	// handling collection deletion
	useEffect(() => {
		var collectionIds = collections.map((collection: Collection) => collection.collectionId);

		if (!collectionIds.includes(Number(collectionId)) && (isOnCollectionsPage || isOnDiscoveryPage)) {
			const minId = collectionIds.length > 0 ? Math.min(...collectionIds) : 0;
			router.push(`/${path}/${minId}`);
		}
	}, [collections.length]);

	if (!hasAnAccount && !isOnDiscoveryPage) {
		return (
			<div>
				<Modal disableCloseButton={true}>
					<AccountSetupForm />
				</Modal>
			</div>
		);
	}

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
};

export default Layout;
