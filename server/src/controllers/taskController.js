import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  const { title, description, project, assignedTo, dueDate } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const { project, status } = req.query;
  try {
    const query = {};
    if (project) query.project = project;
    if (status) query.status = status;

    if (req.user.role !== 'Admin') {
       const userProjects = await Project.find({ members: req.user._id }).select('_id');
       const projectIds = userProjects.map(p => p._id);
       
       if (project && !projectIds.some(id => id.toString() === project)) {
          return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
       }
       if (!project) {
          query.project = { $in: projectIds };
       }
    }

    const tasks = await Task.find(query).populate('project', 'name').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'Admin' && !task.project.members.includes(req.user._id) && task.assignedTo?.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
