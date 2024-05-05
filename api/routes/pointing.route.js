import express from "express";
import {
  createPointing,
  updatePointing,
  deletePointing,
  getMyPointings,
  getAllPointings
} from "../controllers/pointing.controller.js";

import { verifyToken } from "../utils/verifyUser.js";



const router = express.Router();


router.post('/pointings',verifyToken,createPointing);
router.patch('/pointings/:id', verifyToken,updatePointing);
router.delete('/pointings/:id', verifyToken , deletePointing);
router.get('/my-pointings',  getMyPointings);
router.get('/getpointings', verifyToken,getAllPointings);



export default router;

