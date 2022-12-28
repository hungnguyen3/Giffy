import { createSlice } from '@reduxjs/toolkit';

interface User {
	userId: number;
	username: string;
	profileImgUrl: string;
}

interface UserState {
	value: User | null;
}

const initialState: UserState = {
	value: null,
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
		clearUser: state => {
			state.value = null;
		},
	},
});

export const { populateUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
