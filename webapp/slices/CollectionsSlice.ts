import { createSlice } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { giffyDTO } from '../API/DTO';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
	giffies: giffyDTO[];
}

interface CollectionsState {
	value: Collection[];
	selectedGiffyIds: number[];
	isUploadGiffyWindowOpen: boolean;
	isCreateNewCollectionWindowOpen: boolean;
	isDeleteGiffyConfirmationWindowOpen: boolean;
}

const initialState: CollectionsState = {
	value: [],
	selectedGiffyIds: [],
	isUploadGiffyWindowOpen: false,
	isCreateNewCollectionWindowOpen: false,
	isDeleteGiffyConfirmationWindowOpen: false,
};

export const collectionsSlice = createSlice({
	name: 'collections',
	initialState,
	reducers: {
		populateCollections: (
			state,
			action: {
				payload: Collection[];
				type: string;
			}
		) => {
			const collectionsValue: Collection[] = action.payload;
			state.value = collectionsValue;
		},
		clearCollections: state => {
			state.value = [];
		},
		openUploadGiffyWindow: state => {
			state.isUploadGiffyWindowOpen = true;
		},
		closeUploadGiffyWindow: state => {
			state.isUploadGiffyWindowOpen = false;
		},
		openCreateNewCollectionWindow: state => {
			state.isCreateNewCollectionWindowOpen = true;
		},
		closeCreateNewCollectionWindow: state => {
			state.isCreateNewCollectionWindowOpen = false;
		},
		openDeleteGiffyConfirmationWindow: state => {
			state.isDeleteGiffyConfirmationWindowOpen = true;
		},
		closeDeleteGiffyConfirmationWindow: state => {
			state.isDeleteGiffyConfirmationWindowOpen = false;
		},
		addGiffyToACollection: (
			state,
			action: {
				payload: giffyDTO;
			}
		) => {
			if (state.value) {
				for (let i = 0; i < state.value.length; i++) {
					if (state.value[i].collectionId === action.payload.collectionId) {
						state.value[i].giffies.push(action.payload);
					}
				}
			}
		},
		removeGiffiesFromACollection: (
			state,
			action: {
				payload: {
					collectionId: number;
				};
			}
		) => {
			if (state.value) {
				for (let i = 0; i < state.value.length; i++) {
					if (state.value[i].collectionId === action.payload.collectionId) {
						var giffiesClone = [...state.value[i].giffies];
						var selectedGiffyIdsClone = [...state.selectedGiffyIds];

						var giffiesAfterRemoval = giffiesClone.filter(giffy =>
							selectedGiffyIdsClone.includes(giffy.giffyId)
						);

						state.value[i].giffies = giffiesAfterRemoval;
						state.selectedGiffyIds = [];
					}
				}
			}
		},
		addNewCollection: (
			state,
			action: {
				payload: Collection;
			}
		) => {
			state.value?.push(action.payload);
		},
		addSelectedGiffy: (state, action: { payload: number }) => {
			state.selectedGiffyIds.push(action.payload);
		},
		removeSelectedGiffy: (state, action: { payload: number }) => {
			// Remove from selectedGiffies, but not from Redux giffies list
			const index = state.selectedGiffyIds.indexOf(action.payload);
			if (index !== -1) {
				state.selectedGiffyIds.splice(index, 1);
			}
		},
	},
});

export const {
	populateCollections,
	clearCollections,
	openUploadGiffyWindow,
	closeUploadGiffyWindow,
	openCreateNewCollectionWindow,
	closeCreateNewCollectionWindow,
	addGiffyToACollection,
	removeGiffiesFromACollection,
	addNewCollection,
	addSelectedGiffy,
	removeSelectedGiffy,
	openDeleteGiffyConfirmationWindow,
	closeDeleteGiffyConfirmationWindow,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
