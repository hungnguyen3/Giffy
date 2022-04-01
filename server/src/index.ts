import express from 'express';
import bodyParser from 'body-parser';
const { Client } = require('pg');
import { initTables } from '../db/initTable';

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

	function deleteNathan(req: any, res: any) {
		return res.status(300).json({
			a: req.body.a + 10,
		});
	}

	app.delete('/nathan/:a&:b', deleteNathan);

	app.listen(4000, () => {
		console.log('server running on port 4000');
	});
})();
