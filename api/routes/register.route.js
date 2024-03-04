import  Express  from "express";
import { register, signin } from "../controllers/register.controller.js";



const router = Express.Router();

router.post("/register", register);
router.post("/signin",signin );

export default router;

