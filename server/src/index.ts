import express from 'express';
import bodyParser from 'body-parser';
const cookieParser = require('cookie-parser');
const { Client } = require('pg');
import { initTables } from '../db/initTable';
const userRoute = require('../routes/users');
const collectionRoute = require('../routes/collections');
const giffyRoute = require('../routes/giffies');
import cors from 'cors';
import { ErrorDTO } from '../routes/types/errors-types';
require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-config.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export const firebaseStorage = admin.storage();

export const client = new Client({
	connectionString: process.env.PG_CONNECTION_URL,
});

(async () => {
	const app = express();

	// enable this if you run behind a proxy (e.g. nginx)
	app.set('trust proxy', 1);

	// cors;
	var whitelist: string | string[] = [process.env.CORS_ORIGIN!];

	app.use(
		cors({
			origin: function (origin, callback) {
				if ((process.env.PROD as string) !== 'true') {
					callback(null, true); // allow requests from all origins in dev mode
				} else if (whitelist.indexOf(origin!) !== -1) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
			credentials: true,
			methods: ['GET', 'POST', 'DELETE', 'PUT'],
		})
	);

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }));
	// parse application/json
	app.use(bodyParser.json());
	// parse cookies
	app.use(cookieParser());

	client.connect((err: any) => {
		if (err) {
			console.error('postgres connection error', err.stack);
		} else {
			console.log('connected to postgres server');
		}
	});

	await initTables();

	app.use('/users', userRoute);
	app.use('/collections', collectionRoute);
	app.use('/giffies', giffyRoute);
	// app.use('/collection_user_relationships', userRoute);

	app.use('/mobile/users', userRoute);
	app.use('/mobile/collections', collectionRoute);
	app.use('/mobile/giffies', giffyRoute);

	app.post('/sessionLogin', (req, res) => {
		// Get the ID token passed and the CSRF token.
		// TODO: handle the CSRF token check.
		// const csrfToken = req.body.csrfToken.toString();
		const idToken = req.body.idToken.toString();

		// TODO: Guard against CSRF attacks.
		// if (csrfToken !== req.cookies.csrfToken) {
		// 	res.status(401).send('UNAUTHORIZED REQUEST!');
		// 	return;
		// }

		// Set session expiration to 5 days.
		const expiresIn = 60 * 60 * 24 * 5 * 1000;
		// Create the session cookie. This will also verify the ID token in the process.
		// The session cookie will have the same claims as the ID token.
		// To only allow session cookie setting on recent sign-in, auth_time in ID token
		// can be checked to ensure user was recently signed in before creating a session cookie.
		admin
			.auth()
			.createSessionCookie(idToken, { expiresIn })
			.then(
				(sessionCookie: string) => {
					// Set cookie policy for session cookie.
					const options = { maxAge: expiresIn, httpOnly: true, secure: true };
					res.cookie('session', sessionCookie, options);
					res.status(200).send({ status: 'success: create a login session' });
				},
				() => {
					res.status(401).send({ error: 'UNAUTHORIZED REQUEST!' } as ErrorDTO);
				}
			);
	});

	app.post('/sessionLogout', (_, res) => {
		// Clear the session cookie by setting it to an empty string with an expired date.
		res.cookie('session', '', { expires: new Date(0) });
		res.status(200).send({ status: 'success: clear login session' });
	});

	app.get('/', (_: express.Request, res: express.Response) => {
		res.send('Giffy server! Please do not hack me!');
	});
	app.listen(process.env.PORT || 4000, () => {
		console.log(`server running on port ${process.env.PORT || 4000}`);
	});
})();
