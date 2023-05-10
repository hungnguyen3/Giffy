import { createSlice } from '@reduxjs/toolkit';

interface User {
	userId: number;
	userName: string;
	userEmail: string;
	profileImgS3Url: string;
	profileImgS3Key: string;
}

interface UserState {
	value: User | null;
	finishedAccountSetup: boolean;
}

const initialState: UserState = {
	value: null,
	finishedAccountSetup: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		populateUser: (
			state,
			action: {
				payload: User | null;
				type: string;
			}
		) => {
			const userValue: User | null = action.payload;
			state.value = userValue;
		},
		clearUser: (state) => {
			state.value = null;
		},
		setFinishedAccountSetup: (
			state,
			action: {
				payload: boolean;
				type: string;
			}
		) => {
			const finished: boolean = action.payload;
			state.finishedAccountSetup = finished;
		},
	},
});

export const { populateUser, clearUser, setFinishedAccountSetup } = userSlice.actions;

export default userSlice.reducer;
