import Pole from '../models/pole.model.js';
import Societe from '../models/societe.model.js';



export const addPole = async (req, res) => {
  console.log(req.file); // Add this line

  const { NomP, location } = req.body;

  try {
    const newPole = new Pole({
      NomP,
      location,
      imagepole: req.file ? req.file.path : "" // Check if req.file exists before accessing its path
    });

    await newPole.save();

    res.status(201).json(newPole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSocieteToPole = async (req, res) => {
  const { noms } = req.body;
  const { poleId } = req.params;

  try {
    const pole = await Pole.findById(poleId);
    if (!pole) {
      return res.status(404).json({ message: 'Pole not found' });
    }

    const newSociete = new Societe({ noms });
    await newSociete.save();

    pole.societes.push(newSociete._id);
    await pole.save();

    res.status(201).json(newSociete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSociete = async (req, res) => {
  const { societeId } = req.params;

  try {
    const societe = await Societe.findById(societeId);
    if (!societe) {
      return res.status(404).json({ message: 'Societe not found' });
    }

    await Societe.findByIdAndDelete(societeId);
    await Pole.updateMany(
      { societes: societeId },
      { $pull: { societes: societeId } }
    );

    res.status(200).json({ message: 'Societe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletePole = async (req, res) => {
  const { poleId } = req.params;

  try {
    const pole = await Pole.findById(poleId);
    if (!pole) {
      return res.status(404).json({ message: 'Pole not found' });
    }

    const societes = await Societe.find({ poles: poleId });
    for (let societe of societes) {
      await Societe.findByIdAndDelete(societe._id);
    }

    await Pole.findByIdAndDelete(poleId);

    res.status(200).json({ message: 'Pole and associated Societes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSocietesByPole = async (req, res) => {
  const { poleId } = req.params;

  try {
    const pole = await Pole.findById(poleId).populate('societes');
    if (!pole) {
      return res.status(404).json({ message: 'Pole not found' });
    }

    res.status(200).json(pole.societes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllSocietes = async (req, res) => {
  const societes = await Societe.find();
  res.json(societes);
};


export const getAllPoles = async (req, res) => {
  try {
    const poles = await Pole.find();
    res.json(poles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};