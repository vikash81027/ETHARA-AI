import express from 'express';
import { createTask, getTasks, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createTask)
  .get(protect, getTasks);

router.route('/:id/status')
  .put(protect, updateTaskStatus);

router.route('/:id')
  .delete(protect, admin, deleteTask);

export default router;
