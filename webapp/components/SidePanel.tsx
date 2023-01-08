import styles from '../styles/SidePanel.module.scss';
import { useState } from 'react';
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
	const [width, setWidth] = useState(props.width);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { collectionId } = router.query;

	const closePanel = () => {
		setWidth('0%');
	};
	const collections = useAppSelector(
		(state: RootState) => state.collections.value
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
				<h1>Collections</h1>
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
								href={`/collections/${collection.collectionId}`}
							>
								{collection.collectionName}
							</Link>
						</a>
					);
				})}
				<div className={styles.buttonContainer}>
					<button
						className={styles.createBtn}
						onClick={() => {
							dispatch(openCreateNewCollectionWindow());
						}}
					>
						+
					</button>
				</div>
			</div>
		</div>
	);
};

export default SidePanel;
