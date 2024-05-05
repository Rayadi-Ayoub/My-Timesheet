import Pointing from '../models/pointing.model.js';

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