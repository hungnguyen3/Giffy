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
	selectedGiffyId: number[]; // TODO
	isUploadGiffyWindowOpen: boolean;
	isCreateNewCollectionWindowOpen: boolean;
}

const initialState: CollectionsState = {
	value: [],
	selectedGiffyId: [], // TODO
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
		addSelectedGiffy: (state, action: { payload: number }) => {
			// TODO
			state.selectedGiffyId.push(action.payload);
		},
		removeSelectedGiffy: (state, action: { payload: number }) => {
			// TODO
			console.log(`payload: ${action.payload}`);
			const index = state.selectedGiffyId.indexOf(action.payload);
			if (index !== -1) {
				state.selectedGiffyId.splice(index, 1);
				if (state.value) {
					for (let i = 0; i < state.value.length; i++) {
						for (let j = 0; j < state.value[i].giffies.length; i++) {
							if (state.value[i].giffies[j].giffyId === action.payload) {
								state.value[i].giffies.splice(j, 1);
								console.log(`92929299229929deleted ${j}`);
							}
						}
					}
				}
				console.log('deleted');
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
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
