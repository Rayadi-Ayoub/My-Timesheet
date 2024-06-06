import TypeTache from '../models/typetache.model.js';
import Tache from "../models/tache.model.js";

export const addTypeTache = async (req, res) => {
    const newTypeTache = new TypeTache(req.body);
    try {
      const savedTypeTache = await newTypeTache.save();
      res.status(201).json(savedTypeTache);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

export const getAllTypeTaches = async (req, res) => {
    try {
      const typeTaches = await TypeTache.find().populate('taches');
      res.json(typeTaches);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const addTacheWithTypeTache = async (req, res) => {
  const { nomtache, prixType, prixforfitaire, prixHoraire } = req.body;
  const { typeTacheId } = req.params;

  try {
    let newTache = new Tache({ nomtache, prixType });

    if (prixType === 'forfitaire') {
      newTache.prixforfitaire = prixforfitaire;
      newTache.prixHoraire = 0;
    } else if (prixType === 'horraire') {
      newTache.prixHoraire = prixHoraire;
      newTache.prixforfitaire = 0;
    }

    await newTache.save();

    const typeTache = await TypeTache.findById(typeTacheId);
    if (!typeTache) {
      return res.status(404).json({ message: 'TypeTache not found' });
    }

    typeTache.taches.push(newTache);
    await typeTache.save();

    res.json(newTache);
  } catch (err) {
    console.error('Error adding tache:', err); // Log the error
    res.status(500).json({ message: err.message });
  }
};



export const getTachesByTypeTache = async (req, res) => {
    const { typeTacheId } = req.params;

    try {
      const typeTache = await TypeTache.findById(typeTacheId).populate('taches');
      if (!typeTache) {
        return res.status(404).json({ message: 'TypeTache not found' });
      }

      res.status(200).json(typeTache.taches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const updateTypeTache = async (req, res) => {
    const { typeTacheId } = req.params;

    try {
      const updatedTypeTache = await TypeTache.findByIdAndUpdate(
        typeTacheId,
        req.body,
        { new: true }
      );
      if (!updatedTypeTache) {
        return res.status(404).json({ message: 'TypeTache not found' });
      }
      res.json(updatedTypeTache);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const deleteTypeTache = async (req, res) => {
    const { typeTacheId } = req.params;

    try {
      const deletedTypeTache = await TypeTache.findByIdAndDelete(typeTacheId);
      if (!deletedTypeTache) {
        return res.status(404).json({ message: 'TypeTache not found' });
      }
      res.json(deletedTypeTache);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const getAllTaches = async (req, res) => {
  try {
    const taches = await Tache.find();
    res.json(taches);
  } catch (err) {
    console.error('Error fetching taches:', err); // Log the error
    res.status(500).json({ message: err.message });
  }
};


export const updateTache = async (req, res) => {
  const { tacheId } = req.params;
  const { prixType, prixforfitaire, prixHoraire } = req.body;

  try {
    const updateFields = { nomtache: req.body.nomtache, prixType: req.body.prixType };

    if (prixType === 'forfitaire') {
      updateFields.prixforfitaire = prixforfitaire;
      updateFields.prixHoraire = 0;
    } else if (prixType === 'horraire') {
      updateFields.prixHoraire = prixHoraire;
      updateFields.prixforfitaire = 0;
    }

    const updatedTache = await Tache.findByIdAndUpdate(tacheId, updateFields, { new: true });
    if (!updatedTache) {
      return res.status(404).json({ message: 'Tache not found' });
    }
    res.json(updatedTache);
  } catch (err) {
    console.error('Error updating tache:', err); // Log the error
    res.status(500).json({ message: err.message });
  }
};

export const deleteTache = async (req, res) => {
  const { tacheId } = req.params;

  try {
    const deletedTache = await Tache.findByIdAndDelete(tacheId);
    if (!deletedTache) {
      return res.status(404).json({ message: 'Tache not found' });
    }
    res.json(deletedTache);
  } catch (err) {
    console.error('Error deleting tache:', err); // Log the error
    res.status(500).json({ message: err.message });
  }
};

