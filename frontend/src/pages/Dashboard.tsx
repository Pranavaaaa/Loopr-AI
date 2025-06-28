import { useEffect, useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  message, 
  Layout, 
  Button, 
  Drawer, 
  Space 
} from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BlurLoadingOverlay from "../components/Loading";

const { Header, Content } = Layout;
const { Title } = Typography;
const COLORS = ["#52c41a", "#ff4d4f", "#1890ff", "#faad14", "#13c2c2"];

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalRevenue: 0, totalExpense: 0, transactionCount: 0 });
  const [categoryData, setCategoryData] = useState<{ category: string; value: number }[]>([]);
  const [trendData, setTrendData] = useState<{ month: string; revenue: number; expense: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [summaryRes, catRes, trendRes] = await Promise.all([
          api.get("/transactions/analytics/summary"),
          api.get("/transactions/analytics/category"),
          api.get("/transactions/analytics/trend"),
        ]);
        setSummary(summaryRes.data);
        setCategoryData(catRes.data);
        setTrendData(trendRes.data);
      } catch (err) {
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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
            Dashboard
          </Title>
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
          icon={<TransactionOutlined />}
          block
          style={{ textAlign: "center", padding: "16px 24px" }}
          onClick={() => {
            setDrawerOpen(false);
            navigate("/transactions");
          }}
        >
          Transactions
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

      <BlurLoadingOverlay loading={loading} loadingText="Loading dashboard...">
        <Content style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card title="Total Revenue" bordered style={{ textAlign: "center" }}>
                <Title level={3} style={{ color: "#52c41a" }}>${summary.totalRevenue.toLocaleString()}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card title="Total Expense" bordered style={{ textAlign: "center" }}>
                <Title level={3} style={{ color: "#ff4d4f" }}>${summary.totalExpense.toLocaleString()}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card title="Transactions" bordered style={{ textAlign: "center" }}>
                <Title level={3}>{summary.transactionCount}</Title>
              </Card>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Category Breakdown" bordered>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Revenue & Expense Trend" bordered>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#52c41a" name="Revenue" />
                    <Line type="monotone" dataKey="expense" stroke="#ff4d4f" name="Expense" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Content>
      </BlurLoadingOverlay>
    </Layout>
  );
}