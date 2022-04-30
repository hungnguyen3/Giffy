import express from 'express';
import bodyParser from 'body-parser';
const { Client } = require('pg');
import { initTables } from '../db/initTable';
const userRoute = require('../routes/users');
const collectionRoute = require('../routes/collections');
const giffyRoute = require('../routes/giffies');

export const client = new Client({
	user: 'postgres',
	database: 'custom-cool-chia',
	password: 'postgres',
	port: 5432,
});

(async () => {
	const app = express();
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
	// app.use('/collection_user_relationships', userRoute);

	app.listen(4000, () => {
		console.log('server running on port 4000');
	});
})();
