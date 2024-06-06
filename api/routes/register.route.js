import  Express  from "express";
import { register, signin } from "../controllers/register.controller.js";
import { verifyToken } from "../utils/verifyUser.js";




const router = Express.Router();

router.post('/register', verifyToken, register);
router.post("/signin",signin );

export default router;

