// project.controller.js
import Projet from '../models/project.model.js';

export const createProject = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const projet = new Projet(req.body);
    const data = await projet.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projets = await Projet.find({
      $or: [
        { creator: userId },
        { employee: userId }
      ]
    })
    .populate('employee')
    .populate('taches')
    .populate('pole')
    .populate('societe_concernes')
    .populate('creator');
    
    res.status(200).json({
      data: projets,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const proj = await Projet.findById(req.params.id)
      .populate('employee')
      .populate('taches')
      .populate('pole')
      .populate('societe_concernes')
      .populate('creator');
    res.status(200).json({
      data: proj,
    });
  } catch (error) {
    res.status(500).send('Error' + error);
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Projet.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data: null,
      message: 'projet supprimé avec succès',
    });
  } catch (error) {
    res.status(500).send('Error' + error);
  }
};

export const updateProject = async (req, res) => {
  try {
    const proj = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      data: proj,
      message: 'projet mis à jour avec succès',
    });
  } catch (error) {
    res.status(500).send('Error' + error);
  }
};
