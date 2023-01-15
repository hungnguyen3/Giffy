import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logIn, logOut } from '../../slices/UserAuthSlice';
import {
	getCollectionsByUserId,
	getGiffiesByCollectionId,
	getUserByFirebaseAuthId,
} from '../../API/serverHooks';
import { clearUser, populateUser } from '../../slices/UserSlice';
import {
	clearCollections,
	Collection,
	populateCollections,
} from '../../slices/CollectionsSlice';
import { app } from '../Firebase/FirebaseInit';
import { ThunkDispatch } from '@reduxjs/toolkit';

interface onCollectionsRoutePopulationProps {
	dispatch: ThunkDispatch<any, any, any>;
	router: any;
	setLoggedIn: any;
}

export const onCollectionsRoutePopulation = (
	props: onCollectionsRoutePopulationProps
) => {
	const { dispatch, router, setLoggedIn } = props;

	onAuthStateChanged(getAuth(app), user => {
		if (user) {
			const userAuth = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
			};

			getUserByFirebaseAuthId(userAuth.uid).then(user => {
				if (user.error) {
					return null;
				}
				const userInfo = {
					userId: user.userId,
					userName: user.userName,
					profileImgUrl: user.profileImgUrl,
				};

				if (userInfo.profileImgUrl && userInfo.userId && userInfo.userName)
					props.dispatch(populateUser(userInfo));
				return userInfo;
			});

			dispatch(logIn(userAuth));
			setLoggedIn(true);
		} else {
			dispatch(logOut());
			dispatch(clearUser());
			dispatch(clearCollections());
			setLoggedIn(false);
			router.push('/auth');
		}
	});
};
