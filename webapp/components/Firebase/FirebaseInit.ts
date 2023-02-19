import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_APIKEY,
	authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
	projectId: process.env.NEXT_PUBLIC_PROJECTID,
	storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
	appId: process.env.NEXT_PUBLIC_APPID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const googleSignIn = async () => {
	try {
		const result = await signInWithPopup(auth, provider);
		const credential = GoogleAuthProvider.credentialFromResult(result);
		const token = credential?.accessToken;
		const user = result.user;

		// TODO: handle csrf token
		user.getIdToken().then(async idToken => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/sessionLogin`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ idToken }),
				}
			);

			if (response.ok) {
				// User is authenticated and session cookie is set
			} else {
				// Authentication failed
				logOut();
			}
		});
	} catch (error) {
		// Handle error
		console.log(error);
	}
};

export const logOut = () => {
	signOut(auth)
		.then(() => {})
		.catch(error => {});
};

export const storage = getStorage(app);
