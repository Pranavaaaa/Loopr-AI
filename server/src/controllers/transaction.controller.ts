import { Request, Response, RequestHandler } from 'express';
import { Transaction, ITransaction } from "../models/transaction.model.js";
import { Parser } from "json2csv";

// Type definitions - Properly extend Request interface
interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    [key: string]: any;
  };
  query: {
    columns?: string;
    [key: string]: any;
  };
}

// Updated TransactionData interface to match the actual model structure
interface TransactionData {
  id: number;
  date: Date | string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
  user_profile: string;
  [key: string]: any; // Allow for additional fields like _id, __v
}

const exportCSV: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { columns } = authenticatedReq.query;

    let fields: string[];
    if (typeof columns === "string") {
      fields = columns.split(",");
    } else {
      fields = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
    }

    // --- Filtering logic (copy from getAllTransactions) ---
    const {
      category,
      status,
      user_id,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
    } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (user_id) filter.user_id = user_id;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount as string);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount as string);
    }
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      filter.$or = [
        { user_id: searchRegex },
        { category: searchRegex },
        { status: searchRegex }
      ];
    }
    // --- End filtering logic ---
    console.log("Exporting transactions with filter:", filter);

    const transactions = await Transaction.find(filter).lean() as TransactionData[];

    const parser = new Parser({ fields });
    const csv: string = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Error exporting CSV",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// GET /api/transactions
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const {
      category,
      status,
      user_id,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "date",
      order = "desc",
      search
    } = req.query;

    // Build MongoDB filter
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (user_id) filter.user_id = user_id;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount as string);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount as string);
    }

    if (search) {
      const searchRegex = new RegExp(search as string, "i");
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
      .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export default { exportCSV, getAllTransactions };