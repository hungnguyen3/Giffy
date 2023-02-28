import express from 'express';
import {
	mandatoryAuthCheck,
	optionalAuthCheck,
} from './middleware/auth-middleware';
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

router.post('/createGiffy', mandatoryAuthCheck, createGiffy);
router.delete(
	'/deleteGiffiesByIds',
	mandatoryAuthCheck,
	findCollectionIdsByGiffyIds,
	async (req, res, next) =>
		(await checkCollectionsAccess('write'))(req, res, next),
	deleteGiffiesByIds
);
router.get(
	'/getGiffyById/:giffyId',
	mandatoryAuthCheck,
	findCollectionIdsByGiffyIds,
	async (req, res, next) =>
		(await checkCollectionsAccess('read'))(req, res, next),
	getGiffyById
);
router.put(
	'/updateGiffyById/:giffyId',
	mandatoryAuthCheck,
	findCollectionIdsByGiffyIds,
	async (req, res, next) =>
		(await checkCollectionsAccess('write'))(req, res, next),
	updateGiffyById
);
router.get(
	'/getGiffiesByCollectionId/:collectionId',
	optionalAuthCheck,
	async (req, res, next) =>
		(await checkCollectionsAccess('read'))(req, res, next),
	getGiffiesByCollectionId
);

module.exports = router;
