import express from 'express';
import { createProject, getProjects, getProjectById, updateProjectMembers, deleteProject } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, admin, deleteProject);

router.route('/:id/members')
  .put(protect, admin, updateProjectMembers);

export default router;
