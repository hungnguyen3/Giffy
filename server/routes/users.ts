import express from "express";
import {
  createUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from "./route-helpers.ts/users-helpers";
const router = express.Router();

router.post("/createUser", createUser);
router.delete("/deleteUserById/:userId", deleteUserById);
router.get("/getUserById/:userId", getUserById);
router.put("/updateUserById/:userId", updateUserById);

module.exports = router;
