import internal from 'stream';
import { client } from '../../src/index';

export const createGiffy = async (req: any, res: any) => {
	try {
		const createGiffy = await client.query(
			`
      INSERT INTO giffies ("collectionId", "firebaseUrl", "likes")
      VALUES ($1, $2)
      RETURNING *;
      `,
			[req.body.collectionId, req.body.firebaseUrl, 0]
		);

		if (createGiffy.rowCount === 1) {
			return res.status(200).send('you have successfully created a giffy');
		}

		return res.status(404).json({ error: 'db error' });
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};

const deleteGiffyUtil = async (collectionId: number, res: any) => {};

export const deleteGiffyById = async (req: any, res: any) => {};

export const getGiffyById = async (req: any, res: any) => {};

export const updateGiffyById = async (req: any, res: any) => {};
