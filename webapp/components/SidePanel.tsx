import styles from '../styles/SidePanel.module.scss';
import { useState } from 'react';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';

interface SidePanelProps {
	width: string;
}

const SidePanel = (props: SidePanelProps) => {
	const [width, setWidth] = useState(props.width);
	const closePanel = () => {
		setWidth('10%');
	};
	const collections = useAppSelector(
		(state: RootState) => state.collections.value
	);

	const openPanel = () => {
		setWidth(props.width);
	};

	return (
		<div className={styles.sidePanel} style={{ width: width }}>
			<div>
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
			</div>

			<a href="/collections/uploadGiffy">Upload</a>
			<a href="/collections">Collections</a>
			{collections?.map(collection => {
				return (
					<a href={`/collections/${collection.collectionId}`}>
						{collection.collectionName}
					</a>
				);
			})}
			<a href="/discovery">Discovery</a>
		</div>
	);
};

export default SidePanel;
