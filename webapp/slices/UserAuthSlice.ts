import { createSlice } from '@reduxjs/toolkit';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
onAuthStateChanged(auth, user => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		const uid = user.uid;
		// ...
	} else {
		// User is signed out
		// ...
	}
});

export const userAuthSlice = createSlice({
	name: 'userAuth',
	initialState: {
		value: 0,
	},
	reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = userAuthSlice.actions;

export default userAuthSlice.reducer;
