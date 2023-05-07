import { createSlice } from '@reduxjs/toolkit';
import { GiffyDTO } from '../types/DTOs/GiffyDTOs';
import { UserDTO } from '../types/DTOs/UserDTOs';
import { Permission } from '../types/enums/Permission';

export interface Collection {
	collectionId: number;
	collectionName: string;
	private: boolean;
	giffies: GiffyDTO[];
	users: { [userEmail: string]: UserAccess };
}

export interface UserAccess {
	collectionId: number;
	user: UserDTO;
	permission: Permission;
}

interface CollectionsState {
	value: { [collectionId: number]: Collection };
	selectedGiffyIds: number[];
	// TODO: users shared with, visibility?
	selectedCollectionToDelete: number | null;
	isUploadGiffyWindowOpen: boolean;
	isCreateNewCollectionWindowOpen: boolean;
	isDeleteConfirmationWindowOpen: boolean;
	isCollectionSettingWindowOpen: boolean;
}

const initialState: CollectionsState = {
	value: {},
	selectedGiffyIds: [],
	selectedCollectionToDelete: null,
	isUploadGiffyWindowOpen: false,
	isCreateNewCollectionWindowOpen: false,
	isDeleteConfirmationWindowOpen: false,
	isCollectionSettingWindowOpen: false,
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
			let tempValue: { [collectionId: number]: Collection } = {};
			for (let collection of collectionsValue) {
				tempValue[collection.collectionId] = collection;
			}
			state.value = tempValue;
		},
		clearCollections: (state) => {
			state.value = {};
		},
		selectACollectionToDelete: (state, action: { payload: number }) => {
			state.selectedCollectionToDelete = action.payload;
		},
		unselectACollectionToDelete: (state) => {
			state.selectedCollectionToDelete = null;
		},
		openUploadGiffyWindow: (state) => {
			state.isUploadGiffyWindowOpen = true;
		},
		closeUploadGiffyWindow: (state) => {
			state.isUploadGiffyWindowOpen = false;
		},
		openCreateNewCollectionWindow: (state) => {
			state.isCreateNewCollectionWindowOpen = true;
		},
		closeCreateNewCollectionWindow: (state) => {
			state.isCreateNewCollectionWindowOpen = false;
		},
		openDeleteConfirmationWindow: (state) => {
			state.isDeleteConfirmationWindowOpen = true;
		},
		closeDeleteConfirmationWindow: (state) => {
			state.isDeleteConfirmationWindowOpen = false;
		},
		openCollectionSettingWindow: (state) => {
			state.isCollectionSettingWindowOpen = true;
		},
		closeCollectionSettingWindow: (state) => {
			state.isCollectionSettingWindowOpen = false;
		},
		addGiffyToACollection: (
			state,
			action: {
				payload: GiffyDTO;
			}
		) => {
			let tempValue = state.value;
			if (action.payload.collectionId in tempValue) {
				tempValue[action.payload.collectionId].giffies.push(action.payload);
			}
			state.value = tempValue;
		},
		//TODO: implement this
		addUsersToACollection: (
			state,
			action: {
				payload: UserAccess;
			}
		) => {
			state.value[action.payload.collectionId].users[action.payload.user.userEmail] = action.payload;
		},
		removeGiffyFromACollection: (
			state,
			action: {
				payload: {
					collectionId: number;
					giffyIds: number[];
				};
			}
		) => {
			let tempValue = state.value;
			if (action.payload.collectionId in tempValue) {
				var giffiesClone = tempValue[action.payload.collectionId].giffies;
				var giffiesAfterRemoval = giffiesClone.filter(
					(giffy) => !action.payload.giffyIds.includes(giffy.giffyId)
				);
				tempValue[action.payload.collectionId].giffies = giffiesAfterRemoval;
				state.value = tempValue;
			}
		},
		addNewCollection: (
			state,
			action: {
				payload: Collection;
			}
		) => {
			state.value[action.payload.collectionId] = action.payload;
		},
		removeCollection: (
			state,
			action: {
				payload: {
					collectionId: number;
				};
			}
		) => {
			var tempValue = state.value;
			delete tempValue[action.payload.collectionId];

			state.value = tempValue;
		},
		updateCollection: (
			state,
			action: {
				payload: {
					collectionId: number;
					collectionName: string;
					private: boolean;
				};
			}
		) => {
			var tempValue = state.value;

			tempValue[action.payload.collectionId].collectionName = action.payload.collectionName;
			tempValue[action.payload.collectionId].private = action.payload.private;

			state.value = tempValue;
		},
		addSelectedGiffy: (state, action: { payload: number }) => {
			state.selectedGiffyIds.push(action.payload);
		},
		removeSelectedGiffy: (state, action: { payload: number }) => {
			// Remove from selectedGiffies, but not from Redux giffies list
			const index = state.selectedGiffyIds.indexOf(action.payload);
			if (index !== -1) state.selectedGiffyIds.splice(index, 1);
		},
		clearSelectedGiffy: (state) => {
			state.selectedGiffyIds = [];
		},
	},
});

export const {
	populateCollections,
	clearCollections,
	selectACollectionToDelete,
	unselectACollectionToDelete,
	openUploadGiffyWindow,
	closeUploadGiffyWindow,
	openCreateNewCollectionWindow,
	closeCreateNewCollectionWindow,
	addGiffyToACollection,
	addUsersToACollection,
	removeGiffyFromACollection,
	addNewCollection,
	removeCollection,
	addSelectedGiffy,
	removeSelectedGiffy,
	clearSelectedGiffy,
	openDeleteConfirmationWindow,
	closeDeleteConfirmationWindow,
	openCollectionSettingWindow,
	closeCollectionSettingWindow,
	updateCollection,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
