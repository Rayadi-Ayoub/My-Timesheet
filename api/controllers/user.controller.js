import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import { roles } from './role.controller.js';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';


const otpStorage = {};

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 8;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      userWithoutPassword,
      totalUsers,
      usersLastMonth
    });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie('token').status(200).json({ message: 'User has been signed out' });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.body.userId,
    {
      $set: {
        profilePicture: req.file.path,
      },
    }
  );
  const { password, ...rest } = updatedUser._doc;
  res.status(200).json(rest);
};

export const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.poste)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      res.send('Error' + error);
    }
  };
};

export const getDepartementsFromUsers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 8;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const departementList = [];
    users.forEach((element) => {
      if (!departementList.includes(element?.departement)) {
        departementList.push(element?.departement);
      }
    });

    res.status(200).json({
      departementList,
    });
  } catch (error) {
    next(error);
  }
};

// export const requestPasswordReset = async (req, res, next) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return next(errorHandler(404, 'User not found'));
//     }

//     const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//     otpStorage[email] = otp;

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: 'ayoub.riadhii@gmail.com',
//         pass: 'gaaw yevc ijcm bvis',
//       },
//     });

//     const mailOptions = {
//       from: 'ayoub.riadhii@gmail.com',
//       to: email,
//       subject: 'Password Reset OTP',
//       text: `Your OTP for password reset is: ${otp}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).json({ error: 'Failed to send email' });
//       } else {
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         return res.status(200).json({ message: 'Email sent successfully' });
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const verifyOtp = async (req, res, next) => {
//   const { email, otp } = req.body;
//   if (otpStorage[email] !== otp) {
//     return next(errorHandler(400, 'Invalid OTP'));
//   }
//   res.status(200).json({ message: 'OTP verified' });
// };

// export const resetPassword = async (req, res, next) => {
//   const { email, newPassword } = req.body;
//   try {
//     const hashPassword = bcryptjs.hashSync(newPassword, 10);
//     await User.findOneAndUpdate({ email }, { password: hashPassword });
//     delete otpStorage[email]; // Remove OTP after successful reset

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (error) {
//     next(error);
//   }
// };


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
      service: 'Gmail',
      auth: {
        user: 'ayoub.riadhii@gmail.com',
       pass: 'gaaw yevc ijcm bvis',
      },
    });

    const mailOptions = {
      from: 'ayoub.riadhii@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
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

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  if (otpStorage[email] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  res.status(200).json({ message: 'OTP verified' });
};

export const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const hashPassword = bcryptjs.hashSync(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashPassword });
    delete otpStorage[email]; // Remove OTP after successful reset

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};