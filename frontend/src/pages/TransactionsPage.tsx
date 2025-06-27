import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, MenuItem, Select, InputLabel, FormControl, Grid
} from "@mui/material";
import TransactionTable from "../components/TransactionTable";
import api from "../services/api";
import type { SelectChangeEvent } from "@mui/material";

const TransactionsPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    user_id: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    search: "",
    page: 1,
  });

  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions", { params: filters });
      setData(res.data.transactions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Transactions</Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select 
              name="category" 
              value={filters.category} 
              onChange={handleSelectChange}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select 
              name="status" 
              value={filters.status} 
              onChange={handleSelectChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField 
            label="User ID" 
            name="user_id" 
            value={filters.user_id} 
            onChange={handleInputChange} 
            fullWidth 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField 
            type="date" 
            label="Start Date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleInputChange} 
            fullWidth 
            InputLabelProps={{ shrink: true }} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField 
            type="date" 
            label="End Date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleInputChange} 
            fullWidth 
            InputLabelProps={{ shrink: true }} 
            />
        </Grid>
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField 
            label="Min Amt" 
            name="minAmount" 
            value={filters.minAmount} 
            onChange={handleInputChange} 
            fullWidth 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField 
            label="Max Amt" 
            name="maxAmount" 
            value={filters.maxAmount} 
            onChange={handleInputChange} 
            fullWidth 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField 
            label="Search" 
            name="search" 
            value={filters.search} 
            onChange={handleInputChange} 
            fullWidth 
          />
        </Grid>
      </Grid>

      <TransactionTable
        data={data}
        currentPage={filters.page}
        onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
        totalPages={totalPages}
      />
    </Box>
  );
};

export default TransactionsPage;