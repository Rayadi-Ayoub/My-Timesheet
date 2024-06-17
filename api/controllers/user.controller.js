import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const otpStorage = {};

// Test API
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

// Update User
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId && req.user.poste !== "admin") {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  // Password validation and hashing
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    req.body.password = bcryptjs.hashSync(req.body.password, saltRounds);
  }

  // Username validation
  if (req.body.username) {
    const { username } = req.body;
    if (username.length < 5 || username.length > 20 || username.includes(' ') ||
        username !== username.toLowerCase() || !/^[a-zA-Z0-9]+$/.test(username)) {
      return next(errorHandler(400, 'Invalid username format'));
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  if (req.user.poste !== "admin" && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    next(error);
  }
};

// Get Users
export const getUsers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
    const userWithoutPassword = users.map(user => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const usersLastMonth = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      userWithoutPassword,
      totalUsers,
      usersLastMonth
    });
  } catch (error) {
    next(error);
  }
};

// Sign Out
export const signout = (req, res, next) => {
  try {
    res.clearCookie('token').status(200).json({ message: 'User has been signed out' });
  } catch (error) {
    next(error);
  }
};

// Upload Profile Image
export const uploadProfileImage = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body.userId, { $set: { profilePicture: req.file.path } }, { new: true });
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Get Departments from Users
export const getDepartementsFromUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    const departementList = [...new Set(users.map(user => user.departement))];

    res.status(200).json({ departementList });
  } catch (error) {
    next(error);
  }
};

// Request Password Reset
export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    otpStorage[email] = otp;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const mailOptions = {
      from: 'rayadiayoub7@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Dear ${user.username},</p>
            <p>You have requested to reset your password. Use the OTP below to reset your password:</p>
            <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
            <p>This OTP is valid for 10 minutes.</p>
            <p>Best regards,<br>Geiser Team</p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error.message}`);
        return res.status(500).json({ message: 'Failed to send email' });
      } else {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return res.status(200).json({ message: 'Email sent successfully' });
      }
    });
  } catch (error) {
    console.error(`Error in requestPasswordReset: ${error.message}`);
    next(error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  if (otpStorage[email] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  res.status(200).json({ message: 'OTP verified' });
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const hashPassword = bcryptjs.hashSync(newPassword, saltRounds);
    await User.findOneAndUpdate({ email }, { password: hashPassword });
    delete otpStorage[email]; 

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
