import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import {roles} from'./role.controller.js'

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
  if (!req.user.isAdmin &&  req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try{
 await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User has been deleted' });
  }catch(error){
    next(error)
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
 const  now = new Date();

 const oneMonthAgo = new Date(
 now.getFullYear(),
  now.getMonth()  - 1,
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
}

export const signout = (req, res , next ) => {
  try{
    res.clearCookie('token').status(200).json({message: 'User has been signed out'})
  }
  catch(error){
    next(error)
  }
};

export const uploadProfileImage = async(req,res ) => {

  
  const updatedUser = await User.findByIdAndUpdate(
    req.body.userId,
    {
      $set: {
        profilePicture: req.file.path,}
    })
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);}


export const grantAccess = (action, resource) => {

    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.poste)[action](resource)
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action",
                })
            }
            next()
        } catch (error) {

            res.send('Error' + error)
        }
    }
}
