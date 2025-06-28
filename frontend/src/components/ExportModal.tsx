import React, { useState } from "react";
import { Modal, Checkbox, Button, message, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "../services/api";

const ALL_COLUMNS = [
  { label: "User ID", value: "user_id" },
  { label: "User Profile", value: "user_profile" },
  { label: "Date", value: "date" },
  { label: "Amount", value: "amount" },
  { label: "Category", value: "category" },
  { label: "Status", value: "status" },
];

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  filters: Record<string, any>;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, filters }) => {
  const [selected, setSelected] = useState<string[]>(ALL_COLUMNS.map(c => c.value));
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    if (selected.length === 0) {
      message.warning("Please select at least one column.");
      return;
    }
    setDownloading(true);
    try {
      // Pass all filters to backend
      const params = {
        columns: selected.join(","),
        ...filters,
      };
      const res = await api.get("/transactions/export", {
        params,
        responseType: "text",
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success("CSV downloaded!");
      onClose();
    } catch (err) {
      message.error("Export failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      title="Export Transactions as CSV"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <p>Select columns to include in your CSV export:</p>
      <Checkbox.Group
        style={{ width: "100%" }}
        value={selected}
        onChange={vals => setSelected(vals as string[])}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {ALL_COLUMNS.map(col => (
            <Checkbox key={col.value} value={col.value}>
              {col.label}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        loading={downloading}
        block
        style={{ marginTop: 24 }}
        onClick={handleExport}
      >
        Export CSV
      </Button>
    </Modal>
  );
};

export default ExportModal;