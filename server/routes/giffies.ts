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
router.delete('/deleteGiffyById/:GiffyId', deleteGiffyById);
router.get('/getGiffyById/:GiffyId', getGiffyById);
router.put('/updateGiffyById/:GiffyId', updateGiffyById);
router.get('/getGiffiesByCollectionId/:collectionId', getGiffiesByCollectionId);
module.exports = router;
