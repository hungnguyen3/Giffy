import express from 'express';
import {
	createGiffy,
	deleteGiffiesByIds,
	getGiffyById,
	updateGiffyById,
	getGiffiesByCollectionId,
} from './route-helpers/giffies-helpers';
const router = express.Router();

router.post('/createGiffy', createGiffy);
router.delete('/deleteGiffiesByIds', deleteGiffiesByIds);
router.get('/getGiffyById/:giffyId', getGiffyById);
router.put('/updateGiffyById/:giffyId', updateGiffyById);
router.get('/getGiffiesByCollectionId/:collectionId', getGiffiesByCollectionId);
module.exports = router;
