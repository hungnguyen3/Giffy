import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Card from '../../components/Card';
import { useEffect, useState } from 'react';
import { getGiffiesByCollectionId } from '../../API/serverHooks';
import { giffyDTO } from '../../API/DTO';
import CardDistributor from '../../components/CardDistributor';
import styles from '../../styles/Collections.module.scss';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import UploadGiffy from '../../components/UploadGiffy';
import layoutStyles from '../../styles/Layout.module.scss';
import { openUploadGiffyWindow } from '../../slices/CollectionsSlice';

const Collections: NextPage = () => {
	const [cards, setCards] = useState<JSX.Element[] | null>(null);
	const router = useRouter();
	const { collection } = router.query;
	const dispatch = useAppDispatch();
	const isUploadGiffyWindowOpen = useAppSelector(
		(state: RootState) => state.collections.isUploadGiffyWindowOpen
	);
	const giffies = useAppSelector((state: RootState) => {
		return state.collections.value?.filter(
			curCollection => curCollection.collectionId === Number(collection)
		)[0]?.giffies;
	});

	useEffect(() => {
		if (collection && !Number.isNaN(Number(collection))) {
			if (giffies) {
				setCards(
					giffies.map((giffy: giffyDTO) => {
						return Card({
							img: giffy.firebaseUrl,
							name: giffy.giffyName,
							likeCount: giffy.likes,
						});
					})
				);
			}
		}
	}, [collection, giffies]);

	return (
		<Layout>
			<button
				className={styles.newGiffyButton}
				onClick={() => {
					dispatch(openUploadGiffyWindow());
				}}
			>
				+
			</button>
			{cards && cards.length > 0 ? (
				<CardDistributor cards={cards} />
			) : (
				<p>No items yet</p>
			)}
			{isUploadGiffyWindowOpen ? (
				<div className={layoutStyles.settingWindow}>
					<UploadGiffy currentCollectionId={Number(collection)} />
				</div>
			) : null}
		</Layout>
	);
};

export default Collections;
