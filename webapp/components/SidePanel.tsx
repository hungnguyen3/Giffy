import styles from '../styles/SidePanel.module.scss';
import { useState } from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';
import Link from 'next/link';

interface SidePanelProps {
	width: string;
}

const SidePanel = (props: SidePanelProps) => {
	const [width, setWidth] = useState(props.width);

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
						<Link href={`/collections/${collection.collectionId}`}>
							{collection.collectionName}
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default SidePanel;
