import Projet from '../models/project.model.js';
import Tache from '../models/tache.model.js'; // Import the Tache model

export const createProject = async (req, res) => {
  try {
    if (req.user.poste !== 'manager') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    console.log("Request Body:", req.body);
    const projet = new Projet(req.body);
    const data = await projet.save();
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.poste;
    let projets;

    if (userRole === 'manager') {
      projets = await Projet.find()
        .populate('employee')
        .populate('pole')
        .populate('societe_concernes')
        .populate('creator');
    } else {
      projets = await Projet.find({ employee: userId })
        .populate('employee')
        .populate('pole')
        .populate('societe_concernes')
        .populate('creator');
    }

    res.status(200).json({ data: projets });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const proj = await Projet.findById(req.params.id)
      .populate('employee')
      .populate('pole')
      .populate('societe_concernes')
      .populate('creator');
      
    if (!proj) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ data: proj });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (req.user.poste !== 'manager') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const project = await Projet.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    if (req.user.poste !== 'manager') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const proj = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!proj) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ data: proj, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStage = async (req, res) => {
  try {
    console.log('Received request to update task stage:', req.body);

    const { projectId, taskId, stage } = req.body;

    if (!projectId || !taskId || !stage) {
      console.error('Missing required parameters for updating task stage');
      return res.status(400).json({ message: 'Missing required parameters for updating task stage' });
    }

    const project = await Projet.findById(projectId);

    if (!project) {
      console.error(`Project not found with ID: ${projectId}`);
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Project found:', project);

    // const taskIndex = project.tache.findIndex(task => task._id.toString() === taskId);

    // if (taskIndex === -1) {
    //   console.error(`Task not found with ID: ${taskId} in project ID: ${projectId}`);
    //   return res.status(404).json({ message: 'Task not found' });
    // }

    // project.tache[taskIndex].stage = stage;
    project.stage = stage
    await project.save();

    console.log('Task stage updated successfully');
    res.status(200).json({ message: 'Task stage updated successfully' });
  } catch (error) {
    console.error('Error updating task stage:', error);
    res.status(500).json({ message: error.message });
  }
};
