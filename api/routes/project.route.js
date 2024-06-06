import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  updateProject,
  updateTaskStage,
} from '../controllers/project.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createProject', verifyToken, createProject);
router.get('/getProjects', verifyToken, getProjects);
router.get('/getProjectById/:id', verifyToken, getProjectById);
router.delete('/deleteProject/:id', verifyToken, deleteProject);
router.put('/updateProject/:id', verifyToken, updateProject);
router.patch('/updateTaskStage', verifyToken, updateTaskStage);

export default router;
