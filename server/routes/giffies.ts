import express from 'express';
import auth from './middleware/auth-middleware';
import { checkCollectionsAccess } from './middleware/collections-middleware';
import { findCollectionIdsByGiffyIds } from './middleware/giffies-middleware';
import {
	createGiffy,
	deleteGiffiesByIds,
	getGiffyById,
	updateGiffyById,
	getGiffiesByCollectionId,
} from './route-helpers/giffies-helpers';
const router = express.Router();

router.post('/createGiffy', auth, createGiffy);
router.delete(
	'/deleteGiffiesByIds',
	auth,
	findCollectionIdsByGiffyIds,
	async (req, res, next) =>
		(await checkCollectionsAccess('write'))(req, res, next),
	deleteGiffiesByIds
);
router.get(
	'/getGiffyById/:giffyId',
	auth,
	findCollectionIdsByGiffyIds,
	async (req, res, next) =>
		(await checkCollectionsAccess('read'))(req, res, next),
	getGiffyById
);
router.put(
	'/updateGiffyById/:giffyId',
	auth,
	findCollectionIdsByGiffyIds,
	async (req, res, next) =>
		(await checkCollectionsAccess('write'))(req, res, next),
	updateGiffyById
);
router.get(
	'/getGiffiesByCollectionId/:collectionId',
	auth,
	async (req, res, next) =>
		(await checkCollectionsAccess('read'))(req, res, next),
	getGiffiesByCollectionId
);
module.exports = router;
