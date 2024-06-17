import Pointing from "../models/pointing.model.js";
import moment from 'moment';
import Tache from "../models/tache.model.js";
import User from "../models/user.model.js";
import { body, validationResult } from 'express-validator';
import xss from 'xss';

// Create Pointing
export const createPointing = [
  body('timeStart').notEmpty().isString().trim().escape(),
  body('timeEnd').notEmpty().isString().trim().escape(),
  body('tache').notEmpty().isMongoId().trim().escape(),
  body('createdBy').notEmpty().isMongoId().trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const timeStart = new Date(`1970-01-01T${xss(req.body.timeStart)}:00`);
    const timeEnd = new Date(`1970-01-01T${xss(req.body.timeEnd)}:00`);
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

      let costTask = 0;
      if (tache.prixType === 'forfitaire' && tache.prixforfitaire) {
        costTask = parseFloat(tache.prixforfitaire.toFixed(3));
      } else if (tache.prixType === 'horraire' && tache.prixHoraire) {
        costTask = parseFloat((diffInHours * tache.prixHoraire).toFixed(3));
      }
      pointing.costTask = costTask;

      const user = await User.findById(pointing.createdBy);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      let costEmp = parseFloat((diffInHours * user.employeeCost).toFixed(3));
      pointing.costEmp = costEmp;

      let costearned = parseFloat((diffInHours * (user.billingcost - user.employeeCost)).toFixed(3));
      pointing.costearned = costearned;

      await pointing.save();
      res.status(201).send(pointing);
    } catch (error) {
      res.status(400).send(error);
    }
  }
];

// Update Pointing
export const updatePointing = [
  body('id').notEmpty().isMongoId().trim().escape(),

  async (req, res) => {
    try {
      const pointing = await Pointing.findOne({
        _id: xss(req.params.id),
        createdBy: req.user._id,
      });

      if (!pointing) {
        return res.status(404).send();
      }

      Object.keys(req.body).forEach((key) => {
        pointing[key] = xss(req.body[key]);
      });

      await pointing.save();
      res.send(pointing);
    } catch (error) {
      res.status(400).send(error);
    }
  }
];

// Delete Pointing
export const deletePointing = async (req, res) => {
  try {
    const pointing = await Pointing.findOneAndDelete({
      _id: xss(req.params.id),
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

// Get All Pointings
export const getAllPointings = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let showAll = true;
  const reporting = req.query.reporting === 'true';
  if(page !== undefined && limit !== undefined)
    showAll = req.query.showAll === 'true';
  const user = req.user;

  try {
    let pointings = null;
    if (
      ((user.poste === 'manager' || user.poste === 'admin') && showAll) || 
      ((user.poste === 'controller' || user.poste === 'admin') && reporting)
    ) {
      pointings = await Pointing.find({})
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username employeeCost billingcost")
        .populate("tache", "nomtache prixforfitaire prixType prixHoraire")
        .populate("societe", "noms")
        .populate("pole")
        .populate("typeTache");
    } else {
      pointings = await Pointing.find({ createdBy: user._id })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username employeeCost billingcost")
        .populate("tache", "nomtache prixforfitaire prixType prixHoraire")
        .populate("societe", "noms")
        .populate("pole")
        .populate("typeTache");
    }

    if (!pointings.length) {
      return res.status(400).json({ message: 'No pointings found' });
    }

    const total = await Pointing.countDocuments({});

    const formattedPointings = pointings.map(pointing => {
      let costTask = 0;
      if (pointing.tache.prixType === 'forfitaire' && pointing.tache.prixforfitaire) {
        costTask = parseFloat(pointing.tache.prixforfitaire.toFixed(3));
      } else if (pointing.tache.prixType === 'horraire' && pointing.tache.prixHoraire) {
        costTask = parseFloat((pointing.timeDifference * pointing.tache.prixHoraire).toFixed(3));
      }

      const costEmp = pointing.createdBy ? parseFloat((pointing.timeDifference * pointing.createdBy.employeeCost).toFixed(3)) : 0;
      const costEarned = pointing.createdBy ? parseFloat((pointing.timeDifference * (pointing.createdBy.billingcost - pointing.createdBy.employeeCost)).toFixed(3)) : 0;

      return {
        ...pointing._doc,
        costTask,
        costEmp,
        costEarned
      };
    });

    res.json({
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pointings: formattedPointings,
    });
  } catch (error) {
    res.status(500).json([]);
  }
};

// Get Pointings by User ID
export const getPointingsByUserId = async (req, res) => {
  const userId = xss(req.params.userId);
  const week = xss(req.body.week);
  const pointings = await Pointing.find({ createdBy: userId });

  const filteredPointings = pointings.filter(pointing => {
    const pointingWeek = moment(pointing.createdAt).format('YYYY-ww');
    return pointingWeek === week;
  });

  const totalTimeDifferenceByWeek = filteredPointings.reduce((acc, pointing) => {
    const month = moment(pointing.createdAt).format('YYYY-MM');
    const week = moment(pointing.createdAt).format('YYYY-ww');
    const day = moment(pointing.createdAt).format('YYYY-MM-DD');
    const timeDifference = moment(pointing.timeEnd, 'HH:mm').diff(moment(pointing.timeStart, 'HH:mm'), 'hours');

    if (!acc.monthly[month]) {
      acc.monthly[month] = 0;
    }
    if (!acc.weekly[week]) {
      acc.weekly[week] = 0;
    }
    if (!acc.daily[day]) {
      acc.daily[day] = 0;
    }

    acc.monthly[month] += timeDifference;
    acc.weekly[week] += timeDifference;
    acc.daily[day] += timeDifference;

    return acc;
  }, { 
    monthly: {},
    weekly: {},
    daily: {} });

  res.json({ pointings: filteredPointings, totalTimeDifferenceByWeek });
};

// Get Most Selected Societe
export const getMostSelectedSociete = async (req, res) => {
  try {
    const pointings = await Pointing.find().populate('societe');

    if (!pointings.length) {
      return res.status(404).json({ message: 'No pointings found' });
    }

    const societeCounts = pointings.reduce((acc, pointing) => {
      const societeName = pointing.societe ? xss(pointing.societe.noms) : null;

      if (societeName) {
        if (!acc[societeName]) {
          acc[societeName] = 0;
        }
        acc[societeName] += 1;
      }

      return acc;
    }, {});

    if (!Object.keys(societeCounts).length) {
      return res.status(404).json({ message: 'No societes found in pointings' });
    }

    const mostSelectedSociete = Object.keys(societeCounts).reduce((a, b) =>
      societeCounts[a] > societeCounts[b] ? a : b
    );

    res.json({ mostSelectedSociete });
  } catch (error) {
    console.error('Error in getMostSelectedSociete:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get New Chart Data
export const getNewChartData = async (req, res) => {
  const { startDate, endDate, userIds } = req.body;

  try {
    const pointings = await Pointing.find({
      createdBy: { $in: userIds },
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    })
      .populate("createdBy", "username employeeCost billingcost")
      .populate("societe", "noms")
      .populate("tache", "prixforfitaire prixType prixHoraire");

    const aggregatedData = pointings.reduce((acc, pointing) => {
      const societeName = pointing.societe ? xss(pointing.societe.noms) : 'Unknown';

      if (!acc[societeName]) {
        acc[societeName] = {
          societe: societeName,
          hoursWorked: 0,
          costEarned: 0,
          prixHoraire: 0,
          prixforfitaire: 0,
        };
      }

      acc[societeName].hoursWorked += pointing.timeDifference;

      if (pointing.createdBy && pointing.createdBy.employeeCost != null && pointing.createdBy.billingcost != null) {
        const costEarned = parseFloat((pointing.timeDifference * (pointing.createdBy.billingcost - pointing.createdBy.employeeCost)).toFixed(3));
        acc[societeName].costEarned += costEarned;
      } else {
        console.warn(`Missing employeeCost or billingcost for user in pointing ID: ${pointing._id}`);
      }

      if (pointing.tache.prixType === 'horraire') {
        acc[societeName].prixHoraire += pointing.tache.prixHoraire * pointing.timeDifference;
      } else if (pointing.tache.prixType === 'forfitaire') {
        acc[societeName].prixforfitaire += pointing.tache.prixforfitaire;
      }

      return acc;
    }, {});

    const newChartData = Object.values(aggregatedData);

    res.status(200).json(newChartData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get Weekly Hours by Societe
export const getWeeklyHoursBySociete = async (req, res) => {
  const { startDate, endDate, userIds } = req.body;

  if (!startDate || !endDate || !userIds) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");
    const weeks = [];
    let current = start.clone().startOf('isoWeek');
    while (current.isBefore(end) || current.isSame(end)) {
      let week = current.format("YYYY-ww");
      if (current.year() > parseInt(week.substring(0, 4))) {
        week = `${current.year()}-01`;
      }
      weeks.push(week);
      current.add(1, 'week');
    }

    const pointings = await Pointing.find({
      createdBy: { $in: userIds },
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate("createdBy", "username employeeCost billingcost")
      .populate("societe", "noms")
      .populate("tache", "prixforfitaire prixType prixHoraire");

    const weeklyData = {};

    weeks.forEach((week) => {
      weeklyData[week] = {};
    });

    pointings.forEach((pointing) => {
      const week = moment(pointing.createdAt).format("YYYY-ww");
      const societeName = pointing.societe ? xss(pointing.societe.noms) : "Unknown";

      if (!weeklyData[week][societeName]) {
        weeklyData[week][societeName] = {
          hours: 0,
          forfitaire: 0,
          horraire: 0,
          costearned: 0,
          total: 0,
        };
      }

      weeklyData[week][societeName].hours += pointing.timeDifference;

      if (pointing.tache) {
        if (pointing.tache.prixType) {
          if (pointing.tache.prixType === 'forfitaire') {
            weeklyData[week][societeName].forfitaire += pointing.tache.prixforfitaire;
          } else if (pointing.tache.prixType === 'horraire') {
            weeklyData[week][societeName].horraire += pointing.tache.prixHoraire * pointing.timeDifference;
          }
        } else {
          console.warn(`Missing prixType for tache in pointing ID: ${pointing._id}`);
        }
      } else {
        console.warn(`Missing tache for pointing ID: ${pointing._id}`);
      }

      // Calculate costearned
      if (pointing.createdBy && pointing.createdBy.employeeCost != null && pointing.createdBy.billingcost != null) {
        let costearned = parseFloat((pointing.timeDifference * (pointing.createdBy.billingcost - pointing.createdBy.employeeCost)).toFixed(3));
        weeklyData[week][societeName].costearned += costearned;
      } else {
        console.warn(`Missing employeeCost or billingcost for user in pointing ID: ${pointing._id}`);
      }

      // Calculate total
      weeklyData[week][societeName].total = weeklyData[week][societeName].forfitaire + weeklyData[week][societeName].horraire;
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    console.error("Error in getWeeklyHoursBySociete:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


// Get Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
