import router from 'next/router';
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
import { isResponseMessageSuccess, ResponseMessage } from '../types/ResponseMessage';
import CollectionService from '../API/CollectionService';
import GiffyService from '../API/GiffyService';

export const DeleteConfirmationWindow = () => {
	const { collectionId } = router.query;
	const dispatch = useAppDispatch();
	const selectedGiffies = useAppSelector((state: RootState) => state.collections.selectedGiffyIds);
	const collectionToBeDeleted = useAppSelector((state: RootState) => state.collections.selectedCollectionToDelete);

	return (
		<div className={styles.centeredBox}>
			<div className={styles.buttonContainer}>
				<button
					className={styles.cancelButton}
					onClick={() => {
						dispatch(clearSelectedGiffy());
						dispatch(unselectACollectionToDelete());
						dispatch(closeDeleteConfirmationWindow());
						//dispatch(openCreateNewCollectionWindow());
					}}
				>
					Cancel
				</button>
				<button
					className={styles.deleteButton}
					onClick={() => {
						if (collectionToBeDeleted) {
							CollectionService.deleteCollectionByCollectionId(collectionToBeDeleted).then(
								(deleteCollectionByCollectionIdRes: ResponseMessage<null>) => {
									if (isResponseMessageSuccess(deleteCollectionByCollectionIdRes)) {
										dispatch(removeCollection({ collectionId: collectionToBeDeleted }));
										dispatch(unselectACollectionToDelete());
										dispatch(closeDeleteConfirmationWindow());
									} else {
										dispatch(unselectACollectionToDelete());
										dispatch(closeDeleteConfirmationWindow());
										alert(deleteCollectionByCollectionIdRes.message);
									}
								}
							);

							return;
						}

						if (selectedGiffies && selectedGiffies.length > 0) {
							GiffyService.deleteGiffiesByIds({
								giffyIds: selectedGiffies,
							}).then((deleteGiffiesByIdsRes: ResponseMessage<null>) => {
								if (isResponseMessageSuccess(deleteGiffiesByIdsRes)) {
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
									alert(deleteGiffiesByIdsRes.message);
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
