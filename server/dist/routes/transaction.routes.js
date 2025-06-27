import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";
const router = express.Router();
router.get("/", authUser, transactionController.getAllTransactions);
router.get("/export", authUser, transactionController.exportCSV);
export default router;
