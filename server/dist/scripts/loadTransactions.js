import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Transaction } from "../models/transaction.model.js";
// Connect to DB
mongoose.connect(process.env.DB_CONNECT)
    .then(async () => {
    console.log("Connected to MongoDB");
    // Load JSON file
    const filePath = path.join(__dirname, "transactions.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const transactions = JSON.parse(rawData);
    // Clear old data (optional)
    await Transaction.deleteMany({});
    console.log("Old data cleared");
    // Insert new data
    await Transaction.insertMany(transactions);
    console.log("Transactions inserted:", transactions.length);
    process.exit(0);
})
    .catch((err) => {
    console.error("DB Error:", err);
    process.exit(1);
});
