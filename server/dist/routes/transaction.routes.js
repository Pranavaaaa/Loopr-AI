import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";
const router = express.Router();
// router.get("/", authUser, transactionController.getTransactions);
// router.post("/", authUser, transactionController.createTransaction);
router.get("/export", authUser, transactionController.exportCSV);
export default router;
