import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import userServices from '../services/user.services.js';
import blackListTokenModel from '../models/blackListedTokens.js';
const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
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
        res.status(201).json({ token, user });
    }
    catch (error) {
        next(error);
    }
};
const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.array() });
            return;
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = user.generateAuthToken();
        res.status(200).json({ token, user });
    }
    catch (error) {
        next(error);
    }
};
const getUserProfile = async (req, res, next) => {
    return res.status(200).json(res.user);
};
export const logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(400).json({ message: 'No token provided' });
            return;
        }
        res.clearCookie('token');
        await blackListTokenModel.create({ token });
        res.status(200).json({ message: 'Logged Out' });
    }
    catch (error) {
        next(error);
    }
};
export default { registerUser, loginUser, getUserProfile, logoutUser };
