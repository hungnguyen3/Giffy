import { createSlice } from '@reduxjs/toolkit';
import { giffyDTO } from '../API/DTO';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
	giffies: giffyDTO[];
}

interface CollectionsState {
	value: Collection[] | null;
	isUploadGiffyWindowOpen: boolean;
}

const initialState: CollectionsState = {
	value: null,
	isUploadGiffyWindowOpen: false,
};

export const collectionsSlice = createSlice({
	name: 'collections',
	initialState,
	reducers: {
		populateCollections: (
			state,
			action: {
				payload: Collection[] | null;
				type: string;
			}
		) => {
			const collectionsValue: Collection[] | null = action.payload;
			state.value = collectionsValue;
		},
		clearCollections: state => {
			state.value = null;
		},
		openUploadGiffyWindow: state => {
			state.isUploadGiffyWindowOpen = true;
		},
		closeUploadGiffyWindow: state => {
			state.isUploadGiffyWindowOpen = false;
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
	},
});

export const {
	populateCollections,
	clearCollections,
	openUploadGiffyWindow,
	closeUploadGiffyWindow,
	addGiffyToACollection,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
