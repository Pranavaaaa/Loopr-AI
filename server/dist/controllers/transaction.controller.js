import { Transaction } from "../models/transaction.model.js";
import { Parser } from "json2csv";
const exportCSV = async (req, res) => {
    try {
        const authenticatedReq = req;
        const { columns } = authenticatedReq.query;
        let fields;
        if (typeof columns === "string") {
            fields = columns.split(",");
        }
        else {
            fields = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
        }
        // --- Filtering logic (copy from getAllTransactions) ---
        const { category, status, user_id, startDate, endDate, minAmount, maxAmount, search, } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (status)
            filter.status = status;
        if (user_id)
            filter.user_id = user_id;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = new Date(startDate);
            if (endDate)
                filter.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount)
                filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount)
                filter.amount.$lte = parseFloat(maxAmount);
        }
        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { user_id: searchRegex },
                { category: searchRegex },
                { status: searchRegex }
            ];
        }
        // --- End filtering logic ---
        console.log("Exporting transactions with filter:", filter);
        const transactions = await Transaction.find(filter).lean();
        const parser = new Parser({ fields });
        const csv = parser.parse(transactions);
        res.header("Content-Type", "text/csv");
        res.attachment("transactions.csv");
        res.send(csv);
    }
    catch (error) {
        res.status(500).json({
            message: "Error exporting CSV",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
// GET /api/transactions
export const getAllTransactions = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Filters
        const { category, status, user_id, startDate, endDate, minAmount, maxAmount, sortBy = "date", order = "desc", search } = req.query;
        // Build MongoDB filter
        const filter = {};
        if (category)
            filter.category = category;
        if (status)
            filter.status = status;
        if (user_id)
            filter.user_id = user_id;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = new Date(startDate);
            if (endDate)
                filter.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount)
                filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount)
                filter.amount.$lte = parseFloat(maxAmount);
        }
        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { user_id: searchRegex },
                { category: searchRegex },
                { status: searchRegex }
            ];
        }
        // Total count before pagination
        const total = await Transaction.countDocuments(filter);
        // Fetch paginated & sorted results
        const transactions = await Transaction.find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            transactions
        });
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export default { exportCSV, getAllTransactions };
