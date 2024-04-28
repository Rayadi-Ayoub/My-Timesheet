import express from "express";
import {createProject,getProjects,getProjectById,deleteProject,updateProject} from '../controllers/project.controller.js'
const router = express.Router();
router.post('/createProject',createProject)
router.get('/getProjects',getProjects)
router.get('/getProjectById/:id',getProjectById)
router.get('/deleteProject/:id',deleteProject)
router.get('/updateProject/:id',updateProject)
export default router;