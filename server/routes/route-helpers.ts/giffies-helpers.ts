import internal from 'stream';
import { client } from '../../src/index';

export const createGiffy = async (req: any, res: any) => {
	try {
		const createGiffy = await client.query(
			`
      INSERT INTO giffies ("giffyId", "firebaseUrl", "likes")
      VALUES ($1, $2)
      RETURNING *;
      `,
			[req.body.giffyId, req.body.firebaseUrl, 0]
		);

		if (createGiffy.rowCount === 1) {
			return res.status(200).send('you have successfully created a giffy');
		}

		return res.status(404).json({ error: 'db error' });
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};

export const deleteGiffyById = async (req: any, res: any) => {
	try {
		const deleteGiffyRes = await client.query(
			`
			  DELETE FROM giffies WHERE "giffyId" = $1;
		  `,
			[req.body.giffyId]
		);

		if (deleteGiffyRes.rowCount <= 0)
			return res.status(404).send('There is no such giffy');

		if (deleteGiffyRes.rowCount === 1)
			return res
				.status(200)
				.send('you have successfully deleted a giffy uid: ' + req.body.giffyId);

		if (deleteGiffyRes.rowCount > 1)
			return res
				.status(404)
				.send('error occurred, more than one giffy with the same id');
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};

export const getGiffyById = async (req: any, res: any) => {};

export const updateGiffyById = async (req: any, res: any) => {};
