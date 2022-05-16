import { client } from '../../src/index';

export const createGiffy = async (req: any, res: any) => {
	try {
		if (!req.body.firebaseUrl)
			return res.status(400).send('missing required parameter(s)');

		const createGiffy = await client.query(
			`
      INSERT INTO giffies ("firebaseUrl", "likes")
      VALUES ($1, $2)
      RETURNING *;
      `,
			[req.body.firebaseUrl, 0]
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
		if (!req.params.giffyId)
			return res.status(400).send('missing required parameter(s)');

		const deleteGiffyRes = await client.query(
			`
			  DELETE FROM giffies WHERE "giffyId" = $1;
		  `,
			[req.params.giffyId]
		);

		if (deleteGiffyRes.rowCount <= 0)
			return res.status(404).send('There is no such giffy');

		if (deleteGiffyRes.rowCount === 1)
			return res
				.status(200)
				.send(
					'you have successfully deleted a giffy uid: ' + req.params.giffyId
				);

		if (deleteGiffyRes.rowCount > 1)
			return res
				.status(404)
				.send('error occurred, more than one giffy with the same id');
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};

export const getGiffyById = async (req: any, res: any) => {
	try {
		if (!req.params.giffyId)
			return res.status(400).send('missing required parameter(s)');

		const getGiffyRes = await client.query(
			`
		    SELECT* FROM giffies WHERE "giffyId" = $1;
		  `,
			[req.params.giffyId]
		);

		if (getGiffyRes.rowCount <= 0)
			return res.status(404).send('There is no such giffy');

		if (getGiffyRes.rowCount === 1)
			return res.status(200).send(getGiffyRes.rows[0]);

		if (getGiffyRes.rowCount > 1)
			return res
				.status(404)
				.send('error occurred, more than one giffy with the same id');
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};

export const updateGiffyById = async (req: any, res: any) => {
	try {
		if (!req.params.giffyId)
			return res.status(400).send('missing required parameter(s)');

		const updateGiffyRes = await client.query(
			`
        UPDATE giffies
        SET 
				"collectionId" = COALESCE($1, "collectionId"), "firebaseUrl"= COALESCE($2, "firebaseUrl"),
				"giffyName" = COALESCE($3, "giffyName"), "likes" = COALESCE($4, "likes")
        WHERE "giffyId" = $5;
      `,
			[
				req.body.collectionId,
				req.body.firebaseUrl,
				req.body.giffyName,
				req.body.likes,
				req.params.giffyId,
			]
		);
		if (updateGiffyRes.rowCount <= 0)
			return res.status(404).send('There is no such giffy');

		if (updateGiffyRes.rowCount === 1)
			return res
				.status(200)
				.send(
					'you have successfully update a giffy uid: ' + req.params.giffyId
				);

		if (updateGiffyRes.rowCount > 1)
			return res
				.status(404)
				.send('error occurred, more than one giffy with the same id');
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};
