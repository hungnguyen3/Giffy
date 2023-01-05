import { createSlice } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { collectionDTO, giffyDTO } from '../API/DTO';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
	giffies: giffyDTO[];
}

interface CollectionsState {
	value: Collection[];
	selectedGiffyId: number[];
	isUploadGiffyWindowOpen: boolean;
	isCreateNewCollectionWindowOpen: boolean;
	isDeleteGiffyConfirmationWindowOpen: boolean;
}

const initialState: CollectionsState = {
	value: [],
	selectedGiffyId: [],
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
		addNewCollection: (
			state,
			action: {
				payload: Collection;
			}
		) => {
			state.value?.push(action.payload);
		},
		addSelectedGiffy: (state, action: { payload: number }) => {
			state.selectedGiffyId.push(action.payload);
		},
		removeSelectedGiffy: (state, action: { payload: number }) => {
			// Remove from selectedGiffies, but not from Redux giffies list
			const index = state.selectedGiffyId.indexOf(action.payload);
			if (index !== -1) {
				state.selectedGiffyId.splice(index, 1);
			}
		},
		deleteGiffyFromStore: (
			state,
			action: { payload: { collectionID: number; giffyId: number } }
		) => {
			if (state.value) {
				for (let collection of state.value) {
					if (collection.collectionId === action.payload.collectionID) {
						for (let i = 0; i < collection.giffies.length; i++) {
							if (collection.giffies[i].giffyId === action.payload.giffyId) {
								collection.giffies.splice(i, 1);
								i--; // Decrement i to account for the removed element
								break;
							}
						}
						break;
					}
				}
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
	addNewCollection,
	addSelectedGiffy,
	removeSelectedGiffy,
	openDeleteGiffyConfirmationWindow,
	closeDeleteGiffyConfirmationWindow,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
