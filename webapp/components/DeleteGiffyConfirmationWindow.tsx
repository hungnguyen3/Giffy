import { deleteObject, ref } from 'firebase/storage';
import router from 'next/router';
import { giffyDTO } from '../API/DTO';
import { deleteGiffyById } from '../API/serverHooks';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
	closeDeleteGiffyConfirmationWindow,
	removeGiffyFromACollection,
	removeSelectedGiffy,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import styles from '../styles/DeleteGiffyConfirmationWindow.module.scss';
import { storage } from './Firebase/FirebaseInit';

export const DeleteGiffyConfirmationWindow = () => {
	const selectedGiffies = useAppSelector(
		(state: RootState) => state.collections.selectedGiffyIds
	);
	const { collection } = router.query;
	const giffies = useAppSelector((state: RootState) => {
		return state.collections.value?.filter(
			curCollection => curCollection.collectionId === Number(collection)
		)[0]?.giffies;
	});
	const dispatch = useAppDispatch();

	function deleteGiffyFromStore(): any {
		throw new Error('Function not implemented.');
	}

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
											// 1. delete giffy from Firebase
											const giffyStorageRef = ref(storage, giffy.firebaseRef);
											deleteObject(giffyStorageRef)
												.then(() => {
													// 2. delete giffy from database
													deleteGiffyById(giffy.giffyId)
														.then(response => {
															// 3. delete from Redux store
															// not working
															if (!response.error) {
																dispatch(
																	removeGiffyFromACollection({
																		collectionId: Number(collection),
																		giffyId: giffyId,
																	})
																);
																dispatch(removeSelectedGiffy(giffyId));
															}
														})
														.catch(err => console.log(err));
												})
												.catch(err => console.log(err));
										});
								}
							} catch (error) {
								console.log(error);
							}
						});
						dispatch(closeDeleteGiffyConfirmationWindow());
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
};
