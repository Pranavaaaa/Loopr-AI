import { Transaction } from "../models/transaction.model.js";
import { Parser } from "json2csv";
const exportCSV = async (req, res) => {
    try {
        // Type assertion to access user property
        const authenticatedReq = req;
        const { columns } = authenticatedReq.query;
        // Updated default fields to match the actual model structure
        let fields;
        if (typeof columns === "string") {
            fields = columns.split(",");
        }
        else {
            fields = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
        }
        // Query using user_id instead of user to match the model
        const transactions = await Transaction.find({ user_id: authenticatedReq.user._id }).lean();
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
export default { exportCSV };
