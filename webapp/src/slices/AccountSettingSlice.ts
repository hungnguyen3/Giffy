import { createSlice } from '@reduxjs/toolkit';

export const accountSettingSlice = createSlice({
	name: 'accountSetting',
	initialState: {
		isAccountSettingOpen: false,
	},
	reducers: {
		open: state => {
			state.isAccountSettingOpen = true;
		},
		close: state => {
			state.isAccountSettingOpen = false;
		},
	},
});

export const { open, close } = accountSettingSlice.actions;

export default accountSettingSlice.reducer;
