import styles from '../styles/SidePanel.module.scss';
import { useEffect, useState } from 'react';
import { BiLeftArrow, BiRightArrow, BiTimer } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';
import { openCreateNewCollectionWindow } from '../slices/CollectionsSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface SidePanelProps {
	width: string;
}

const SidePanel = (props: SidePanelProps) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [width, setWidth] = useState(props.width);
	const { collectionId } = router.query;
	const path = router.pathname.split('/')[1];
	const isOnDiscoveryPage = path == 'discovery';
	const [
		isDisabledToWaitForStoreToRepopulate,
		setIsDisabledToWaitForStoreToRepopulate,
	] = useState(true);

	const closePanel = () => {
		setWidth('0%');
	};
	const collections = useAppSelector((state: RootState) =>
		Object.values(state.collections.value)
	);

	const hasAnAccount = useAppSelector((state: RootState) =>
		state.user.value ? true : false
	);

	const openPanel = () => {
		setWidth(props.width);
	};

	useEffect(() => {
		setTimeout(() => {
			setIsDisabledToWaitForStoreToRepopulate(false);
		}, 1000);
	}, []);

	return (
		<div className={styles.sidePanel} style={{ width: width }}>
			<button
				className={styles.btn}
				onClick={() => {
					if (width >= props.width) {
						closePanel();
					} else {
						openPanel();
					}
				}}
			>
				{width >= props.width ? <BiLeftArrow /> : <BiRightArrow />}
			</button>

			<div className={styles.sidePanelContent}>
				<h1>{path.charAt(0).toUpperCase() + path.slice(1)}</h1>
				<div className={styles.collectionsContainer}>
					{collections?.map(collection => {
						return (
							<Link
								key={collection.collectionId}
								href={`/${path}/${collection.collectionId}`}
							>
								<a
									style={
										collection.collectionId === Number(collectionId)
											? { backgroundColor: '#7da79d' }
											: undefined
									}
									key={collection.collectionId}
								>
									{collection.collectionName}
								</a>
							</Link>
						);
					})}
				</div>
				<div className={styles.buttonContainer}>
					<button
						className={styles.createBtn}
						style={{
							opacity: isOnDiscoveryPage ? 0 : 1,
							cursor: isOnDiscoveryPage ? 'auto' : 'pointer',
						}}
						disabled={isOnDiscoveryPage ? true : false}
						onClick={() => {
							dispatch(openCreateNewCollectionWindow());
						}}
					>
						+
					</button>
				</div>
				{!isOnDiscoveryPage && (
					<div className={styles.buttonContainer}>
						<button
							className={styles.goToDiscoveryBtn}
							disabled={isDisabledToWaitForStoreToRepopulate}
							onClick={() => {
								router.push('/discovery/0');
							}}
						>
							{isDisabledToWaitForStoreToRepopulate ? (
								<BiTimer size={32} />
							) : (
								<p>Discovery</p>
							)}
						</button>
					</div>
				)}
				{isOnDiscoveryPage && hasAnAccount && (
					<div className={styles.buttonContainer}>
						<button
							className={styles.goToDiscoveryBtn}
							disabled={isDisabledToWaitForStoreToRepopulate}
							onClick={() => {
								router.push('/collections/0');
							}}
						>
							{isDisabledToWaitForStoreToRepopulate ? (
								<BiTimer size={32} />
							) : (
								<p>Collections</p>
							)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SidePanel;
