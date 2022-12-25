import { createSlice } from '@reduxjs/toolkit';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
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
	},
});

export const {
	populateCollections,
	clearCollections,
	openUploadGiffyWindow,
	closeUploadGiffyWindow,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
