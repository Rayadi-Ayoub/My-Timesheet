import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPointing,
  updatePointing,
  deletePointing,
  getPointingsByUserId,
  getAllPointings,
  getMostSelectedSociete,
  getNewChartData,
  getWeeklyHoursBySociete,
  getUsers,
 
} from "../controllers/pointing.controller.js";




const router = express.Router();

router.post("/pointings", verifyToken, createPointing);
router.patch("/pointings/:id", verifyToken, updatePointing);
router.delete("/pointings/:id", verifyToken, deletePointing);
router.get("/getpointings", verifyToken, getAllPointings);
router.post('/pointings/user/:userId', getPointingsByUserId);
router.get('/most-selected-societe',verifyToken, getMostSelectedSociete);
router.post('/pointings/newchartdata', getNewChartData);
router.post('/pointings/weeklyhoursbysociete', getWeeklyHoursBySociete);
router.get('/users', getUsers);


export default router;
