import router from 'next/router';
import { giffyDTO } from '../API/DTO';
import { deleteGiffyById } from '../API/serverHooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
	closeDeleteGiffyConfirmationWindow,
	removeSelectedGiffy,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import styles from '../styles/DeleteGiffyConfirmationWindow.module.scss';

export const DeleteGiffyConfirmationWindow = () => {
	const selectedGiffies = useAppSelector(
		(state: RootState) => state.collections.selectedGiffyId
	);
	const { collection } = router.query;
	const giffies = useAppSelector((state: RootState) => {
		return state.collections.value?.filter(
			curCollection => curCollection.collectionId === Number(collection)
		)[0]?.giffies;
	});
	const dispatch = useAppDispatch();

	return (
		<div className={styles.centeredBox}>
			<div className={styles.buttonContainer}>
				<button
					className={styles.cancelButton}
					onClick={() => {
						dispatch(closeDeleteGiffyConfirmationWindow());
						selectedGiffies.map((giffyId: number) => {
							dispatch(removeSelectedGiffy(giffyId));
						});
					}}
				>
					Cancel
				</button>
				<button
					className={styles.deleteButton}
					onClick={() => {
						selectedGiffies.map(async (giffyId: number) => {
							try {
								if (giffies) {
									giffies
										.filter((giffy: giffyDTO) => {
											return giffy.giffyId === giffyId;
										})
										.map((giffy: giffyDTO) => {
											// TODO: delete from Firebase
											console.log(`try to delete ${giffy.giffyId}`);
											deleteGiffyById(giffy.giffyId)
												.then(() =>
													console.log(`deleted ${giffy.giffyId} from database`)
												)
												.catch(err => console.log(err));
											// TODO: delete from Redux store
											try {
												dispatch(removeSelectedGiffy(giffyId));
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
					Delete
				</button>
			</div>
		</div>
	);
};
