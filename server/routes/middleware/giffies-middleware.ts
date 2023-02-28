import express from 'express';
import { client } from '../../src/index';

export interface WithCollectionIdsRequest extends express.Request {
	collectionIds?: string[];
}

export async function findCollectionIdsByGiffyIds(
	req: WithCollectionIdsRequest,
	res: express.Response,
	next: express.NextFunction
) {
	const giffyIds: string[] = [];

	if (req.params.giffyId) {
		giffyIds.push(req.params.giffyId);
	}

	if (req.body.giffyIds && Array.isArray(req.body.giffyIds)) {
		giffyIds.push(...req.body.giffyIds);
	}

	if (giffyIds.length === 0) {
		return res.status(400).send({ error: 'At least one giffy ID is required' });
	}

	try {
		const result = await client.query(
			`
				SELECT "collectionId"
				FROM giffies
				WHERE "giffyId" IN (${giffyIds.map((_, i) => `$${i + 1}`).join(',')})
			`,
			giffyIds
		);

		const collectionIds = result.rows.map(
			(row: { collectionId: any }) => row.collectionId
		);
		req.collectionIds = collectionIds;
		next();
	} catch (error) {
		console.error('Error finding collections by giffy IDs:', error);
		res.status(500).send({ error: 'Server error giffy middleware' });
	}
}
