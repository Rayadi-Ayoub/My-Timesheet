import express from "express";
import {
  addPointing,
  deletePointing,
    getPointingsByUser,
    
} from "../controllers/pointing.controller.js";




const router = express.Router();


router.post("/addPointing", addPointing);
router.delete("/deletePointing/:pointingId", deletePointing);
router.get("/getPointingsByUser/:userId", getPointingsByUser);

export default router;