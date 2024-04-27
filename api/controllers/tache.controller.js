
import Tache from '../models/tache.model.js';
import TypeTache from '../models/typetache.model.js';



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
      const {  nomTache, prixforfitaire } = req.body;
      const {typeTacheId} = req.params;
  
      try {
          const newTache = new Tache({ NomTache: nomTache, prixforfitaire });
          await newTache.save();
  
          const typeTache = await TypeTache.findById(typeTacheId);
          if (!typeTache) {
              return res.status(404).json({ message: 'TypeTache not found' });
          }
  
          typeTache.taches.push(newTache);
          await typeTache.save();
  
          res.json(newTache);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  };

export const getTachesByTypeTache = async (req, res) => {
    try {
        const typeTache = await TypeTache.findById(req.params.id).populate('taches');
        res.json(typeTache.taches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};