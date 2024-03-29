import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { useEffect, useState } from 'react';
import CardDistributor from '../../components/CardDistributor';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import styles from '../../styles/Collections.module.scss';

import { openDeleteConfirmationWindow, openUploadGiffyWindow } from '../../slices/CollectionsSlice';
import { GiffyDTO } from '../../types/DTOs/GiffyDTOs';

const Collection: NextPage = () => {
	const [cards, setCards] = useState<JSX.Element[] | null>(null);
	const router = useRouter();
	const { collectionId } = router.query;
	const dispatch = useAppDispatch();

	const giffies = useAppSelector((state: RootState) => {
		if (Object.keys(state.collections.value).length !== 0) {
			if (Number(collectionId) in state.collections.value) {
				return state.collections.value[Number(collectionId)].giffies;
			}
		}
	});

	const selectedGiffies = useAppSelector((state: RootState) => state.collections.selectedGiffyIds);

	const user = useAppSelector((state: RootState) => state.user.value);

	useEffect(() => {
		if (collectionId && !Number.isNaN(Number(collectionId))) {
			if (!giffies) return setCards(null);

			if (giffies) {
				setCards(
					giffies.map((giffy: GiffyDTO) => {
						return (
							<div key={giffy.giffyId}>
								<Card img={giffy.giffyS3Url} name={giffy.giffyName} giffyId={giffy.giffyId}></Card>
							</div>
						);
					})
				);
			}
		}
	}, [collectionId, giffies]);

	if (Number(collectionId) == 0) {
		return (
			<Layout>
				<div className={styles.centeredBox}>
					<h1>Hi {user?.userName}👋, create a collection to get started</h1>
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
			{selectedGiffies.length > 0 ? (
				<button
					className={styles.deleteGiffyButton}
					onClick={() => {
						dispatch(openDeleteConfirmationWindow());
					}}
				>
					-
				</button>
			) : null}
			{cards && cards.length > 0 ? (
				<div className={styles.centeredBox} style={{ justifyContent: 'start' }}>
					<CardDistributor cards={cards} />
				</div>
			) : (
				<div className={styles.centeredBox}>
					<h1>Empty collection 👀</h1>
				</div>
			)}
		</Layout>
	);
};

export default Collection;
