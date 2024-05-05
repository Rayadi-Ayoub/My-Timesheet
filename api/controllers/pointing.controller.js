import Pointing from '../models/pointing.model.js';
import Tache from '../models/tache.model.js';

export const createPointing = async (req, res) => {  
  const pointing = new Pointing({
    ...req.body,
   
  });

  try {
    await pointing.save();
    res.status(201).send(pointing);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updatePointing = async (req, res) => {
  try {
    const pointing = await Pointing.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!pointing) {
      return res.status(404).send();
    }

    Object.keys(req.body).forEach((key) => {
      pointing[key] = req.body[key];
    });

    await pointing.save();
    res.send(pointing);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deletePointing = async (req, res) => {
  try {
    const pointing = await Pointing.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!pointing) {
      return res.status(404).send();
    }

    res.send(pointing);
  } catch (error) {
    res.status(500).send(error);
  }
};




export const getMyPointings = async (req, res) => {
  try {
    const pointings = await Pointing.find({ createdBy: req.user._id });
    res.json(pointings);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the pointings' });
  }
};

export const getAllPointings = async (req, res) => {
  try {
    const pointings = await Pointing.find({});
    res.json(pointings);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the pointings' });
  }
};




export const calculateCost = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) {
      return res.status(404).json({ error: 'Tache not found' });
    }

    const timeStart = new Date(tache.timeStart);
    const timeEnd = new Date(tache.timeEnd);
    const diffInHours = Math.abs(timeEnd - timeStart) / 36e5; // Convert difference in milliseconds to hours

    const prixforfitaire = tache.prixforfitaire;
    const cost = diffInHours * prixforfitaire;

    res.json({ cost });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while calculating the cost' });
  }
};