import express from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();
// Validation middleware arrays with proper typing
const registerValidation = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("fullname.firstname")
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters long"),
];
const loginValidation = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
router.post("/register", registerValidation, userController.registerUser);
router.post("/login", loginValidation, userController.loginUser);
router.get("/logout", authUser, userController.logoutUser);
export default router;
