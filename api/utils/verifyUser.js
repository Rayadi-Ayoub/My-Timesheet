import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token || req.headers['authorization'];
  
  if (!token) {
    return next(errorHandler(403, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    next(errorHandler(401, 'Unauthorized'));
  }
};
