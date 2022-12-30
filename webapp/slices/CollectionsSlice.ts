import { createSlice } from '@reduxjs/toolkit';
import { giffyDTO } from '../API/DTO';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
	giffies: giffyDTO[];
}

interface CollectionsState {
	value: Collection[];
	isUploadGiffyWindowOpen: boolean;
	isCreateNewCollectionWindowOpen: boolean;
}

const initialState: CollectionsState = {
	value: [],
	isUploadGiffyWindowOpen: false,
	isCreateNewCollectionWindowOpen: false,
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
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
