import express from 'express';
import {
	createCollection,
	deleteCollectionById,
	getCollectionById,
	updateCollectionById,
	getCollectionsByUserId,
	//addUsersToCollectionsByUserId,
} from './route-helpers.ts/collections-helpers';
const router = express.Router();

router.post('/createCollection', createCollection);
router.delete('/deleteCollectionById/:collectionId', deleteCollectionById);
router.get('/getCollectionById/:collectionId', getCollectionById);
router.put('/updateCollectionById/:collectionId', updateCollectionById);
router.get('/getCollectionsByUserId/:userId', getCollectionsByUserId);
//TODO: add put router for adding users
// router.get(
// 	'/addUsersToCollectionByUserId/:userId',
// 	addUsersToCollectionsByUserId
// );

module.exports = router;
