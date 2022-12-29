import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { useEffect, useState } from 'react';
import { giffyDTO } from '../../API/DTO';
import CardDistributor from '../../components/CardDistributor';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import styles from '../../styles/Collections.module.scss';

import { openUploadGiffyWindow } from '../../slices/CollectionsSlice';

const Collections: NextPage = () => {
	const [cards, setCards] = useState<JSX.Element[] | null>(null);
	const router = useRouter();
	const { collection } = router.query;
	const dispatch = useAppDispatch();
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

	if (Number(collection) == 0) {
		return (
			<Layout>
				<div className={styles.centeredBox}>
					<h1>Create a collection to get started</h1>
				</div>
			</Layout>
		);
	}

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
				<h1>No items yet</h1>
			)}
		</Layout>
	);
};

export default Collections;
