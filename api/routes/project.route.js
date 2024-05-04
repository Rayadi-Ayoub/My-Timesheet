import express from "express";
import {createProject,getProjects,getProjectById,deleteProject,updateProject} from '../controllers/project.controller.js'
import { verifyToken } from "../utils/verifyUser.js";
import {grantAccess} from "../controllers/user.controller.js";
const router = express.Router();
router.post('/createProject',createProject)
router.get('/getProjects',verifyToken,grantAccess("deleteAny","profile"),getProjects)
router.get('/getProjectById/:id',getProjectById)
router.get('/deleteProject/:id',deleteProject)
router.get('/updateProject/:id',updateProject)
export default router;