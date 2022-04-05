import express from "express";
import {
  createCollection,
  deleteCollectionById,
  getCollectionById,
  updateCollectionById,
} from "./route-helpers.ts/collections-helpers";
const router = express.Router();

router.post("/createCollection", createCollection);
router.delete("/deleteCollectionById/:collectionId", deleteCollectionById);
router.get("/getCollectionById/:collectionId", getCollectionById);
router.put("/updateCollectionById/:collectionId", updateCollectionById);

module.exports = router;
