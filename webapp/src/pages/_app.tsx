import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { store } from '../store';
import { Provider } from 'react-redux';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/router';
import { Loading } from '../components/Loading';

interface AppPropsWithCognitoAuth extends AppProps {
	signOut: () => void;
	user: any;
}

Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }: AppPropsWithCognitoAuth) {
	const router = useRouter();

	if (!router.isReady) {
		return <Loading />;
	}

	let path = router.pathname.split('/')[1];
	const isOnDiscoveryPage = path == 'discovery';

	if (isOnDiscoveryPage) {
		return (
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		);
	} else {
		return (
			<Authenticator>
				<Provider store={store}>
					<Component {...pageProps} />
				</Provider>
			</Authenticator>
		);
	}
}

export default MyApp;
