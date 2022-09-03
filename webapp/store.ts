import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/CounterSlice';
import userAuthReducer from './slices/UserAuthSlice';
import accountSettingReducer from './slices/AccountSettingSlice';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		userAuth: userAuthReducer,
		accountSetting: accountSettingReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
