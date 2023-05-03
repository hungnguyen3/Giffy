import { Auth } from 'aws-amplify';

export async function signOut() {
	try {
		await Auth.signOut({ global: true });
	} catch (error) {
		console.log('error signing out: ', error);
	}
}
