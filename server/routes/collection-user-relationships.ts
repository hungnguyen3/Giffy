import express from 'express';
import { addCollectionUserRelationship } from './route-helpers/collection-user-relationships-helpers';
const router = express.Router();

router.post('/addCollectionUserRelationship', addCollectionUserRelationship);

module.exports = router;
