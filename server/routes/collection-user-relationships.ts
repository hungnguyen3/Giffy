import express from 'express';
import {
	addCollectionUserRelationship,
	getUsersByCollectionId,
} from './route-helpers/collection-user-relationships-helpers';
const router = express.Router();

router.post('/addCollectionUserRelationship', addCollectionUserRelationship);
router.get('/getUsersByCollectionId/:collectionId', getUsersByCollectionId);
module.exports = router;
