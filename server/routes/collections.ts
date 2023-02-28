import express from 'express';
import {
	createCollection,
	deleteCollectionById,
	getCollectionById,
	updateCollectionById,
	getCurrentUserCollections,
	getPublicCollections,
} from './route-helpers/collections-helpers';
import { mandatoryAuthCheck } from './middleware/auth-middleware';
import { checkCollectionsAccess } from './middleware/collections-middleware';
const router = express.Router();

router.post('/createCollection', mandatoryAuthCheck, createCollection);
router.delete(
	'/deleteCollectionById/:collectionId',
	mandatoryAuthCheck,
	async (req, res, next) =>
		(await checkCollectionsAccess('admin'))(req, res, next),
	deleteCollectionById
);

router.get(
	'/getCollectionById/:collectionId',
	mandatoryAuthCheck,
	async (req, res, next) =>
		(await checkCollectionsAccess('read'))(req, res, next),
	getCollectionById
);
router.put(
	'/updateCollectionById/:collectionId',
	mandatoryAuthCheck,
	async (req, res, next) =>
		(await checkCollectionsAccess('write'))(req, res, next),
	updateCollectionById
);
router.get(
	'/getCurrentUserCollections',
	mandatoryAuthCheck,
	getCurrentUserCollections
);
router.get('/getPublicCollections', getPublicCollections);

module.exports = router;
