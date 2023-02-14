import styles from '../styles/SidePanel.module.scss';
import { useEffect, useState } from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';
import Link from 'next/link';
import { openCreateNewCollectionWindow } from '../slices/CollectionsSlice';
import { useRouter } from 'next/router';

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
							<a
								style={
									collection.collectionId === Number(collectionId)
										? { backgroundColor: '#7da79d' }
										: undefined
								}
								key={collection.collectionId}
							>
								<Link
									key={collection.collectionId}
									href={`/${path}/${collection.collectionId}`}
								>
									{collection.collectionName}
								</Link>
							</a>
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
						<button className={styles.goToDiscoveryBtn}>
							<Link href="/discovery/0">Discovery Page</Link>
						</button>
					</div>
				)}
				{isOnDiscoveryPage && hasAnAccount && (
					<div className={styles.buttonContainer}>
						<button className={styles.goToDiscoveryBtn}>
							<Link href="/collections/0">Your collections</Link>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SidePanel;
