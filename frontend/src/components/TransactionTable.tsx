import React from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, Button, Avatar, Box
} from "@mui/material";

interface Props {
  data: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransactionTable: React.FC<Props> = ({ data, currentPage, totalPages, onPageChange }) => {
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((t, i) => (
            <TableRow key={i}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={t.user_profile} alt={t.user_id} />
                  {t.user_id}
                </Box>
              </TableCell>
              <TableCell>{new Date(t.date).toDateString()}</TableCell>
              <TableCell style={{ color: t.category === "Revenue" ? "lightgreen" : "salmon" }}>
                {t.category === "Expense" ? "-" : "+"}${t.amount}
              </TableCell>
              <TableCell>
                <span style={{
                  backgroundColor: t.status === "Paid" ? "#4caf50" : "#ff9800",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "0.8rem"
                }}>
                  {t.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >Previous</Button>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >Next</Button>
      </Box>
    </Box>
  );
};

export default TransactionTable;
