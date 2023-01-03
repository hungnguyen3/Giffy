import express from 'express';
import {
	createGiffy,
	deleteGiffyById,
	getGiffyById,
	updateGiffyById,
	getGiffiesByCollectionId,
} from './route-helpers.ts/giffies-helpers';
const router = express.Router();

router.post('/createGiffy', createGiffy);
router.delete('/deleteGiffyById/:giffyId', deleteGiffyById);
router.get('/getGiffyById/:giffyId', getGiffyById);
router.put('/updateGiffyById/:giffyId', updateGiffyById);
router.get('/getGiffiesByCollectionId/:collectionId', getGiffiesByCollectionId);
module.exports = router;
