import { createSlice } from '@reduxjs/toolkit';
import { GiffyDTO } from '../types/DTOs/GiffyDTOs';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
	giffies: GiffyDTO[];
}

interface DiscoveryState {
	value: Collection[];
}

const initialState: DiscoveryState = {
	value: [],
};

export const discoverySlice = createSlice({
	name: 'discovery',
	initialState,
	reducers: {
		populateDiscoveryCollections: (
			state,
			action: {
				payload: Collection[];
				type: string;
			}
		) => {
			const collectionsValue: Collection[] = action.payload;
			state.value = collectionsValue;
		},
	},
});

export const { populateDiscoveryCollections } = discoverySlice.actions;

export default discoverySlice.reducer;
