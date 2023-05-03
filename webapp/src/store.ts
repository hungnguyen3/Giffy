import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';
import accountSettingReducer from './slices/AccountSettingSlice';
import collectionsReducer from './slices/CollectionsSlice';
import discoveryReducer from './slices/DiscoverySlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		collections: collectionsReducer,
		discovery: discoveryReducer,
		accountSetting: accountSettingReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
