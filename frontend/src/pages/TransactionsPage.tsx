// TransactionsPage.tsx
import React, { useEffect, useState } from "react";
import ExportModal from "../components/ExportModal";
import BlurLoadingOverlay from "../components/Loading";
import { DownloadOutlined } from "@ant-design/icons";
import {
  Layout,
  Typography,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Button,
  Drawer,
  Space,
  InputNumber,
  message,
} from "antd";
import {
  MenuOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import TransactionTable from "../components/TransactionTable";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TransactionsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    user_id: "",
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined,
    dateRange: [] as [string, string] | [],
    search: "",
    page: 1,
  });

  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params: any = {
        ...filters,
        startDate: filters.dateRange[0],
        endDate: filters.dateRange[1],
      };
      delete params.dateRange;
      const res = await api.get("/transactions", { params });
      setData(res.data.transactions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      message.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: dateStrings,
      page: 1,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px #f0f1f2",
          padding: "0 24px",
        }}
      >
        <Space>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            onClick={() => setDrawerOpen(true)}
          />
          <Title level={4} style={{ margin: 0 }}>
            Transactions
          </Title>
        </Space>
        <Space>
          <Button
            icon={<FilterOutlined />}
            onClick={() => message.info("Use the filters below the header!")}
            type="text"
          />
        </Space>
      </Header>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Button
          type="text"
          icon={<DashboardOutlined />}
          block
          style={{ textAlign: "center", padding: "16px 24px" }}
          onClick={() => {
            setDrawerOpen(false);
            navigate("/dashboard");
          }}
        >
          Dashboard
        </Button>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          block
          style={{ textAlign: "center", padding: "16px 24px" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Drawer>

      <BlurLoadingOverlay loading={loading} loadingText="Fetching transactions...">
        <Content style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
              boxShadow: "0 2px 8px #f0f1f2",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={4}>
                <Select
                  allowClear
                  placeholder="Category"
                  value={filters.category || undefined}
                  onChange={(v) => handleFilterChange("category", v)}
                  style={{ width: "100%" }}
                >
                  <Option value="">All</Option>
                  <Option value="Revenue">Revenue</Option>
                  <Option value="Expense">Expense</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  allowClear
                  placeholder="Status"
                  value={filters.status || undefined}
                  onChange={(v) => handleFilterChange("status", v)}
                  style={{ width: "100%" }}
                >
                  <Option value="">All</Option>
                  <Option value="Paid">Paid</Option>
                  <Option value="Pending">Pending</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Input
                  placeholder="User ID"
                  value={filters.user_id}
                  onChange={(e) => handleFilterChange("user_id", e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <RangePicker
                  style={{ width: "100%" }}
                  value={
                    filters.dateRange.length === 2
                      ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
                      : undefined
                  }
                  onChange={handleRangeChange}
                  allowClear
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <InputNumber
                  placeholder="Min Amt"
                  value={filters.minAmount}
                  onChange={(v) => handleFilterChange("minAmount", v)}
                  style={{ width: "100%" }}
                  min={0}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <InputNumber
                  placeholder="Max Amt"
                  value={filters.maxAmount}
                  onChange={(v) => handleFilterChange("maxAmount", v)}
                  style={{ width: "100%" }}
                  min={0}
                />
              </Col>
              <Col xs={24} sm={24} md={6}>
                <Input
                  placeholder="Search"
                  prefix={<SearchOutlined />}
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  allowClear
                />
              </Col>
            </Row>
          </div>

          <TransactionTable
            data={data}
            currentPage={filters.page}
            onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
            totalPages={totalPages}
          />
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => setExportOpen(true)}
          >
            Export CSV
          </Button>
          <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} filters={filters} />
        </Content>
      </BlurLoadingOverlay>
    </Layout>
  );
};

export default TransactionsPage;