import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import transactionController from "../controllers/transaction.controller.js";
const router = express.Router();
router.get("/", authUser, transactionController.getAllTransactions);
router.get("/export", authUser, transactionController.exportCSV);
// Add analytics endpoints:
router.get("/analytics/summary", authUser, transactionController.getSummaryStats);
router.get("/analytics/category", authUser, transactionController.getCategoryBreakdown);
router.get("/analytics/trend", authUser, transactionController.getRevenueExpenseTrend);
export default router;
