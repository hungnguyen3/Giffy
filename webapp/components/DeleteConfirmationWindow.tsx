import router from 'next/router';
import { deleteCollectionsByCollectionId } from '../API/collectionHooks';
import { deleteGiffiesByIds } from '../API/giffyHooks';
import { isDeleteCollectionDTO } from '../API/types/collections-types';
import { ErrorDTO } from '../API/types/errors-types';
import {
	DeleteGiffiesDTO,
	isDeleteGiffiesDTO,
} from '../API/types/giffies-types';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
	clearSelectedGiffy,
	closeDeleteConfirmationWindow,
	removeCollection,
	removeGiffyFromACollection,
	unselectACollectionToDelete,
} from '../slices/CollectionsSlice';
import { RootState } from '../store';
import styles from '../styles/DeleteConfirmationWindow.module.scss';

export const DeleteConfirmationWindow = () => {
	const { collectionId } = router.query;
	const dispatch = useAppDispatch();
	const selectedGiffies = useAppSelector(
		(state: RootState) => state.collections.selectedGiffyIds
	);
	const collectionToBeDeleted = useAppSelector(
		(state: RootState) => state.collections.selectedCollectionToDelete
	);

	return (
		<div className={styles.centeredBox}>
			<div className={styles.buttonContainer}>
				<button
					className={styles.cancelButton}
					onClick={() => {
						dispatch(clearSelectedGiffy());
						dispatch(unselectACollectionToDelete());
						dispatch(closeDeleteConfirmationWindow());
					}}
				>
					Cancel
				</button>
				<button
					className={styles.deleteButton}
					onClick={() => {
						if (collectionToBeDeleted) {
							deleteCollectionsByCollectionId(collectionToBeDeleted).then(
								response => {
									if (isDeleteCollectionDTO(response)) {
										dispatch(
											removeCollection({ collectionId: collectionToBeDeleted })
										);
										dispatch(unselectACollectionToDelete());
										dispatch(closeDeleteConfirmationWindow());
									} else {
										dispatch(unselectACollectionToDelete());
										dispatch(closeDeleteConfirmationWindow());
										alert(
											'something went wrong trying to delete the collection'
										);
									}
								}
							);

							return;
						}

						if (selectedGiffies && selectedGiffies.length > 0) {
							deleteGiffiesByIds({
								giffyIds: selectedGiffies,
							}).then((response: ErrorDTO | DeleteGiffiesDTO) => {
								if (isDeleteGiffiesDTO(response)) {
									dispatch(
										removeGiffyFromACollection({
											collectionId: Number(collectionId),
											giffyIds: selectedGiffies,
										})
									);
									dispatch(clearSelectedGiffy());
									dispatch(closeDeleteConfirmationWindow());
								} else {
									dispatch(clearSelectedGiffy());
									dispatch(closeDeleteConfirmationWindow());
									alert(
										'something went wrong trying to delete the selected giffies'
									);
								}
							});
						}
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
};
