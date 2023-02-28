import express from 'express';
import { client } from '../../src/index';
import * as admin from 'firebase-admin';
import { WithCollectionIdsRequest } from './giffies-middleware';

interface AuthenticatedRequest extends WithCollectionIdsRequest {
	user?: admin.auth.DecodedIdToken;
}

export async function checkCollectionsAccess(
	permission: 'read' | 'write' | 'admin'
): Promise<express.RequestHandler> {
	return async function (
		req: AuthenticatedRequest,
		res: express.Response,
		next: express.NextFunction
	) {
		let collectionIds = [];

		// Add collectionId from req.params
		if (req.params.collectionId) {
			collectionIds.push(req.params.collectionId);
		}

		// Add collectionIds from req.body
		if (req.collectionIds) {
			collectionIds = collectionIds.concat(req.collectionIds);
		}

		// Check whether the collections are public or the user is authenticated
		try {
			const privateResult = await client.query(
				`
          SELECT "collectionId", private FROM collections WHERE "collectionId" = ANY($1::int[])
        `,
				[collectionIds]
			);

			if (privateResult.rowCount === 0) {
				return res.status(404).send('Collections not found');
			}

			const collectionPrivacyMap = privateResult.rows.reduce(
				(
					map: { [x: string]: any },
					row: { collectionId: string | number; private: any }
				) => {
					map[row.collectionId] = row.private;
					return map;
				},
				{}
			);

			for (let i = 0; i < collectionIds.length; i++) {
				const collectionId = collectionIds[i];

				const isPrivate = collectionPrivacyMap[collectionId];

				if (isPrivate && !req.user?.uid) {
					return res.status(401).send('Unauthorized');
				} else if (isPrivate && req.user?.uid) {
					// Check the user's permission to access the collection
					const result = await client.query(
						`
              SELECT * FROM collections
              JOIN collection_user_relationships ON collections."collectionId" = collection_user_relationships."collectionId"
              JOIN users ON users."userId" = collection_user_relationships."userId"
              WHERE collections."collectionId" = $1 AND users."firebaseAuthId" = $2
              AND (
                collection_user_relationships."permission" = $3
                OR (
                  collection_user_relationships."permission" = 'write'
                  AND $3 = 'read'
                )
                OR (
                  collection_user_relationships."permission" = 'admin'
                  AND ($3 = 'read' OR $3 = 'write')
                )
              );
            `,
						[collectionId, req.user?.uid, permission]
					);

					if (result.rows.length !== 1) {
						return res.status(403).send('Forbidden');
					}
				}
			}

			next();
		} catch (error) {
			console.error(`Error checking ${permission} access:`, error);
			res.status(500).send('Server error collection middleware');
		}
	};
}
