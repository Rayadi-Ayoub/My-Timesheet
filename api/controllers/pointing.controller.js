import Pointing from "../models/pointing.model.js";
import moment from 'moment';
import Tache from "../models/tache.model.js";
import User from "../models/user.model.js";

export const createPointing = async (req, res) => {
  const timeStart = new Date(`1970-01-01T${req.body.timeStart}:00`);
  const timeEnd = new Date(`1970-01-01T${req.body.timeEnd}:00`);
  const diffInMilliseconds = Math.abs(timeEnd - timeStart);
  let diffInHours = diffInMilliseconds / (1000 * 60 * 60);

  diffInHours = parseFloat(diffInHours.toFixed(2));

  const pointing = new Pointing({
    ...req.body,
    timeDifference: diffInHours,
  });

  try {
    const tache = await Tache.findById(pointing.tache);
    if (!tache) {
      return res.status(404).send({ message: "Tache not found" });
    }
 // Calculate costPerHours
    const costPerHours = parseFloat((diffInHours * tache.prixforfitaire).toFixed(3));
    pointing.costPerHours = costPerHours;

    const user = await User.findById(pointing.createdBy);

    // Calculate costPerEmp
    const costPerEmp = parseFloat((diffInHours * user.employeeCost).toFixed(3));
    pointing.costPerEmp = costPerEmp ;

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

export const getAllPointings = async (req, res) => {
  const page = Number(req.query.page) || 1; 
  const limit = Number(req.query.limit) || 10; 
  const skip = (page - 1) * limit; 

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

export const getPointingsByUserId = async (req, res) => {
  const userId = req.params.userId;
  const week = req.body.week;
  const pointings = await Pointing.find({ createdBy: userId });

  const filteredPointings = pointings.filter(pointing => {
    const pointingWeek = moment(pointing.createdAt).format('YYYY-ww');
    return pointingWeek === week;
  });

  const totalTimeDifferenceByWeek = filteredPointings.reduce((acc, pointing) => {
  //const month = moment(pointing.createdAt).format('YYYY-MM');
    //const week = moment(pointing.createdAt).format('YYYY-ww');
    const day = moment(pointing.createdAt).format('YYYY-MM-DD');
    const timeDifference = moment(pointing.timeEnd, 'HH:mm').diff(moment(pointing.timeStart, 'HH:mm'), 'hours');

    //if (!acc.monthly[month]) {
      //acc.monthly[month] = 0;
    //}
    //if (!acc.weekly[week]) {
      //acc.weekly[week] = 0;
    //}
    if (!acc.daily[day]) {
      acc.daily[day] = 0;
    }

    //acc.monthly[month] += timeDifference;
    //acc.weekly[week] += timeDifference;
    acc.daily[day] += timeDifference;

    return acc;
  }, { 
    //monthly: {},
   //weekly: {},
    daily: {} });

    res.json({ pointings: filteredPointings, totalTimeDifferenceByWeek });
};

export const getMostSelectedSociete = async (req, res) => {
  const pointings = await Pointing.find().populate('societe');

  const societeCounts = pointings.reduce((acc, pointing) => {
    const societeName = pointing.societe ? pointing.societe.noms : null;

    if (!acc[societeName]) {
      acc[societeName] = 0;
    }

    acc[societeName] += 1;

    return acc;
  }, {});

  
  const mostSelectedSociete = Object.keys(societeCounts).reduce((a, b) => societeCounts[a] > societeCounts[b] ? a : b);

  res.json({ mostSelectedSociete });
};


