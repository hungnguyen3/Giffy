import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { store } from '../store';
import { Provider } from 'react-redux';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AppPropsWithCognitoAuth extends AppProps {
	signOut: () => void;
	user: any;
}

Amplify.configure(awsconfig);

function MyApp({
	Component,
	pageProps,
	signOut,
	user,
}: AppPropsWithCognitoAuth) {
	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default withAuthenticator(MyApp);
