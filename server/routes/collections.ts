import express from 'express';
import {
	createCollection,
	deleteCollectionById,
	getCollectionById,
	updateCollectionById,
	getCollectionsByUserId,
	getPublicCollections,
} from './route-helpers/collections-helpers';
const router = express.Router();

router.post('/createCollection', createCollection);
router.delete('/deleteCollectionById/:collectionId', deleteCollectionById);
router.get('/getCollectionById/:collectionId', getCollectionById);
router.put('/updateCollectionById/:collectionId', updateCollectionById);
router.get('/getCollectionsByUserId/:userId', getCollectionsByUserId);
router.get('/getPublicCollections', getPublicCollections);

module.exports = router;
