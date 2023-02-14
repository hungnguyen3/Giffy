import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { useEffect, useState } from 'react';
import { GiffyDTO } from '../../API/types/giffies-types';
import CardDistributor from '../../components/CardDistributor';
import { useRouter } from 'next/router';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import styles from '../../styles/Collections.module.scss';

const Collection: NextPage = () => {
	const [cards, setCards] = useState<JSX.Element[] | null>(null);
	const router = useRouter();
	const { collectionId } = router.query;
	const giffies = useAppSelector((state: RootState) => {
		if (Number(collectionId) in state.collections.value) {
			return state.collections.value[Number(collectionId)].giffies;
		}
	});

	useEffect(() => {
		if (collectionId && !Number.isNaN(Number(collectionId))) {
			if (!giffies) return setCards(null);

			if (giffies) {
				setCards(
					giffies.map((giffy: GiffyDTO) => {
						return (
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
	}, [collectionId, giffies]);

	if (Number(collectionId) == 0) {
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
			{cards && cards.length > 0 ? (
				<div className={styles.centeredBox} style={{ justifyContent: 'start' }}>
					<CardDistributor cards={cards} />
				</div>
			) : (
				<div className={styles.centeredBox}>
					<h1>No items yet</h1>
				</div>
			)}
		</Layout>
	);
};

export default Collection;
