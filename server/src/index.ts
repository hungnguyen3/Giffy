import express from 'express';
import bodyParser from 'body-parser';
const { Client } = require('pg');
import { initTables } from '../db/initTable';
const userRoute = require('../routes/users');
const collectionRoute = require('../routes/collections');
const giffyRoute = require('../routes/giffies');
const collectionUserRelationshipRoute = require('../routes/collection-user-relationships');
import cors from 'cors';
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
	var whitelist: string | string[];
	if ((process.env.PROD as string) !== 'true') {
		whitelist = ['http://localhost:3000', process.env.CORS_ORIGIN!];
	} else {
		whitelist = process.env.CORS_ORIGIN!;
	}

	app.use(
		cors({
			origin: function (origin, callback) {
				if (whitelist.indexOf(origin!) !== -1) {
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
	app.use('/collection-user-relationships', collectionUserRelationshipRoute);

	app.listen(process.env.PORT || 4000, () => {
		console.log(`server running on port ${process.env.PORT || 4000}`);
	});
})();
