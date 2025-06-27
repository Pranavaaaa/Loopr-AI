import { useEffect, useState } from "react";
import api from "../services/api";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", status: "" });

  useEffect(() => {
    // Fetch transactions with filters
    api.get("/transactions", { params: filters }).then(res => setTransactions(res.data));
  }, [filters]);

  return (
    <div>
      {/* Add filter/search UI here */}
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Date</th><th>Amount</th><th>Category</th><th>Status</th><th>User</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.amount}</td>
              <td>{tx.category}</td>
              <td>{tx.status}</td>
              <td>{tx.user?.fullname?.firstname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}