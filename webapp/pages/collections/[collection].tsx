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

import {
	openUploadGiffyWindow,
	removeSelectedGiffy,
} from '../../slices/CollectionsSlice';
import { deleteGiffyById } from '../../API/serverHooks';

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
	const selectedGiffies = useAppSelector(
		// TODO
		(state: RootState) => state.collections.selectedGiffyId
	);

	useEffect(() => {
		if (collection && !Number.isNaN(Number(collection))) {
			if (giffies) {
				setCards(
					giffies.map((giffy: giffyDTO) => {
						return (
							// TODO: add key to Card
							<div key={giffy.giffyId}>
								<Card
									img={giffy.firebaseUrl}
									name={giffy.giffyName}
									likeCount={giffy.likes}
									giffyId={giffy.giffyId}
								></Card>
							</div>
						);
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
				className={styles.deleteGiffyButton}
				onClick={() => {
					console.log(selectedGiffies);
					selectedGiffies.map(async (giffyId: number) => {
						try {
							// TODO: delete selected giiffy from Firebase by url
							if (giffies) {
								giffies.map((giffy: giffyDTO) => {
									let giffyUrl = giffy.firebaseUrl;
									// TODO: get fileRef
									// let giffyRef: any = '';

									// giffyRef
									// 	.delete()
									// 	.then(() => {
									// 		console.log(`deleted ${giffy.giffyName} from  Firebase`);
									// 	})
									// 	.catch((err: any) => {
									// 		console.log(err);
									// 	});
									// TODO: delete from database
									try {
										deleteGiffyById(giffy.giffyId);
										console.log(`deleted ${giffy.giffyId} from database`);
									} catch (err) {
										console.log(err);
									}
									// TODO: delete from Redux store
									try {
										dispatch(removeSelectedGiffy(giffyId));
										console.log(`deleted ${giffy.giffyId} from Redux store`);
									} catch (err) {
										console.log(err);
									}
								});
							}
						} catch (error) {
							console.log(error);
						}
					});
				}}
			>
				-
			</button>
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
				<div className={styles.centeredBox}>
					<h1>No items yet</h1>
				</div>
			)}
		</Layout>
	);
};

export default Collections;
