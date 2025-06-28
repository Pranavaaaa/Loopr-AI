import React from "react";
import { Table, Avatar, Badge, Typography, Pagination, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface Transaction {
  key: string;
  user_id: string;
  user_profile?: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending" | string;
}

interface Props {
  data: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusColors: Record<string, string> = {
  Paid: "green",
  Pending: "orange",
};

const columns: ColumnsType<Transaction> = [
  {
    title: "User",
    dataIndex: "user_id",
    key: "user_id",
    render: (user_id: string, record: Transaction) => (
      <Space>
        <Avatar src={record.user_profile} alt={user_id} />
        <Text strong>{user_id}</Text>
      </Space>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => (
      <Text>{new Date(date).toLocaleDateString()}</Text>
    ),
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (amount: number, record: Transaction) => (
      <Text
        style={{
          color: record.category === "Revenue" ? "#52c41a" : "#ff4d4f",
          fontWeight: 600,
        }}
      >
        {record.category === "Expense" ? "-" : "+"}${amount.toLocaleString()}
      </Text>
    ),
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Badge
        color={statusColors[status] || "blue"}
        text={status}
        style={{ fontWeight: 500 }}
      />
    ),
    filters: [
      { text: "Paid", value: "Paid" },
      { text: "Pending", value: "Pending" },
    ],
    onFilter: (value, record) => record.status === value,
  },
];

const TransactionTable: React.FC<Props> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <Table
        columns={columns}
        dataSource={data.map((item, idx) => ({
          ...item,
          key: idx.toString(),
        }))}
        pagination={false}
        bordered
        size="middle"
        rowClassName={(_, idx) =>
          idx % 2 === 0 ? "ant-table-row-light" : "ant-table-row-dark"
        }
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <Pagination
          current={currentPage}
          total={totalPages * 10}
          pageSize={10}
          showSizeChanger={false}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default TransactionTable;
