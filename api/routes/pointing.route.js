import express from "express";
import {
  createPointing,
  updatePointing,
  deletePointing,
  getPointingsByUserId,
  getAllPointings,
  getMostSelectedSociete
} from "../controllers/pointing.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/pointings", verifyToken, createPointing);
router.patch("/pointings/:id", verifyToken, updatePointing);
router.delete("/pointings/:id", verifyToken, deletePointing);
router.get("/getpointings", verifyToken, getAllPointings);
router.get('/pointings/user/:userId',verifyToken, getPointingsByUserId);
router.get('/most-selected-societe',verifyToken, getMostSelectedSociete);


export default router;
