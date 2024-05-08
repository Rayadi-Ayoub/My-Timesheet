import Pointing from "../models/pointing.model.js";

import Tache from "../models/tache.model.js";

export const createPointing = async (req, res) => {
  const timeStart = new Date(`1970-01-01T${req.body.timeStart}:00`);
  const timeEnd = new Date(`1970-01-01T${req.body.timeEnd}:00`);
  const diffInMilliseconds = Math.abs(timeEnd - timeStart);
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

  const pointing = new Pointing({
    ...req.body,
    timeDifference: diffInHours,
  });

  try {
    // Fetch the tache document
    const tache = await Tache.findById(pointing.tache);
    if (!tache) {
      return res.status(404).send({ message: "Tache not found" });
    }

    // Calculate costPerHours
    const costPerHours = diffInHours * tache.prixforfitaire;

    // Add costPerHours to the pointing document
    pointing.costPerHours = costPerHours;

    await pointing.save();
    res.status(201).send(pointing);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updatePointing = async (req, res) => {
  try {
    const pointing = await Pointing.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

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
    const pointing = await Pointing.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

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
    res
      .status(500)
      .json({ error: "An error occurred while fetching the pointings" });
  }
};
export const getAllPointings = async (req, res) => {
  const page = Number(req.query.page) || 1; // Get the page number from the query parameters (default to 1 if not provided)
  const limit = Number(req.query.limit) || 10; // Get the number of items per page from the query parameters (default to 10 if not provided)
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  try {
    const pointings = await Pointing.find({})
      .skip(skip) 
      .limit(limit) 
      .populate("createdBy", "username")
      .populate("tache", "nomtache prixforfitaire")
      .populate("societe", "noms");

    const total = await Pointing.countDocuments({}); 

    res.json({
      totalPages: Math.ceil(total / limit), 
      currentPage: page,
      pointings,
    });
  } catch (error) {
    res.status(500).json([]);
  }
};
