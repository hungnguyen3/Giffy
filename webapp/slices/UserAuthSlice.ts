import { createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export type UserAuth = Pick<User, 'uid' | 'email' | 'displayName' | 'photoURL'>;

interface UserAuthState {
	value: UserAuth | null;
}

const initialState: UserAuthState = {
	value: null,
};

export const userAuthSlice = createSlice({
	name: 'userAuth',
	initialState,
	reducers: {
		logIn: (
			state,
			action: {
				payload: UserAuth | null;
				type: string;
			}
		) => {
			const userAuthValue: UserAuth | null = action.payload;
			state.value = userAuthValue;
		},
		logOut: state => {
			state.value = null;
		},
	},
});

export const { logIn, logOut } = userAuthSlice.actions;

export default userAuthSlice.reducer;
