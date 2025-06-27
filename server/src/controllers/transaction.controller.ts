import { Request, Response, RequestHandler } from 'express';
import { Transaction, ITransaction } from "../models/transaction.model";
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
    // Type assertion to access user property
    const authenticatedReq = req as AuthenticatedRequest;
    const { columns } = authenticatedReq.query;
    // Updated default fields to match the actual model structure
    let fields: string[];
    if (typeof columns === "string") {
      fields = columns.split(",");
    } else {
      fields = ["id", "date", "amount", "category", "status", "user_id", "user_profile"];
    }
    
    // Query using user_id instead of user to match the model
    const transactions = await Transaction.find({ user_id: authenticatedReq.user._id }).lean() as TransactionData[];
    
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

export default { exportCSV };