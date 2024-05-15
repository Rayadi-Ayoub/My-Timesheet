import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {


  const {
    username,
    matricule,
    poste,
    departement,
    hiringDate,
    address,
    phone,
    email,
    password,
    employeeCost,
  } = req.body;

  const existingUser = await User.findOne({ matricule });
  if (existingUser) {
    return next(errorHandler(400, "this user exists in your liste"));
  }

  if (
    !username ||
    !matricule ||
    !poste ||
    !departement ||
    !hiringDate ||
    !address ||
    !phone ||
    !email ||
    !password ||
    !employeeCost ||
    username === "" ||
    matricule === "" ||
    poste === "" ||
    departement === "" ||
    hiringDate === "" ||
    address === "" ||
    phone === "" ||
    email === "" ||
    password === "" || 
    employeeCost === ""
    
  ) {
    console.log("error");
    next(errorHandler(400, "Please provide all required fields"));
  }


  const hashPassword = bcryptjs.hashSync(password, 10);

  
  if ( !req.user.isAdmin) {
    return next(errorHandler(400, "You Are not allowed to register a user"));
  }

  const newUser = new User({
    username,
    matricule,
    poste,
    departement,
    hiringDate,
    address,
    phone,
    email,
    employeeCost,
    password: hashPassword,
  });
  try {
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin, poste: validUser.poste },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
