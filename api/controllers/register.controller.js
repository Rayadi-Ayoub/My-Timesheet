import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

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
    billingcost
  } = req.body;

  const existingUser = await User.findOne({ matricule });
  if (existingUser) {
    return next(errorHandler(400, "This user exists in your list"));
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
    employeeCost === "" || 
    billingcost === ""
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  if (!req.user || !req.user.poste === "admin" ) {
    return next(errorHandler(403, "You are not allowed to register a user"));
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
    billingcost,
    password: hashPassword,
  });

  try {
    await newUser.save();

    // Send email if the user is an admin
    if (poste === 'admin') {
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587, // Use 587 for TLS
        secure: false, 
        auth: {
          user: '75869a001@smtp-brevo.com',
          pass: '45SrGhZUJQXHma92', // Your app-specific password
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      });

      const mailOptions = {
        from: 'rayadiayoub7@gmail.com',
        to: email,
        subject: 'Welcome to Geiser!',
        html: `
          <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h2 style="color: #333;">Hi ${username},</h2>
              <p>Welcome to Geiser! We're excited to have you on board.</p>
              <p>Your email is <strong>${email}</strong>, and your password is <strong>${password}</strong>.</p>
              <p>Please use these credentials to log in to the timesheet system.</p>
              <p>Best regards,<br>Geiser Team</p>
            </div>
          </div>
        `,
      };

      console.log('Sending email...');
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          console.error('Error code:', error.code);
          console.error('Response:', error.response);
          console.error('Response code:', error.responseCode);
          console.error('Command:', error.command);
        } else {
          console.log('Email sent successfully:', info.response);
        }
      });
    }

    res.json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
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
      { id: validUser._id, poste: validUser.poste === "admin"  , poste: validUser.poste },
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
