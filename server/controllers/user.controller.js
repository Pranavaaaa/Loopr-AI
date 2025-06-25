import userModel from '../models/user.model.js';
import userServices from '../services/user.services.js';
import { validationResult } from 'express-validator';
import blackListTokenModel from '../models/blackListedTokens.js';

const registerUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, fullname } = req.body;

      console.log(req.body, "user.controller");

      const hashPassword = await userModel.hashPassword(password);

      const user = await userServices.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
      });

      const token = user.generateAuthToken();

      return res.status(201).json({ token, user });
    } catch (error) {
      next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ error: errors.array() });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.status(200).json({ token, user });
    } catch (error) {
      next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    return res.status(200).json(res.user);
};

export const logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    res.clearCookie('token');

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged Out' });
};

export default { registerUser, loginUser, getUserProfile, logoutUser }