import { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";

const TransactionReport = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // filters
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // fetch data (ครั้งเดียวพอ)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions?status=confirm`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ตรวจว่าพร้อมกรองหรือยัง
  const isFilterReady =
    (reportType === "daily" && selectedDate) ||
    (reportType === "monthly" && selectedYear !== "" && selectedMonth !== "");

  // กรองข้อมูล
  const filteredTransactions = isFilterReady
    ? transactions.filter((t) => {
        const d = new Date(t.created_at || t.updated_at || t.appointment?.date);
        if (reportType === "daily") {
          const s = new Date(`${selectedDate}T00:00:00`);
          const e = new Date(`${selectedDate}T23:59:59`);
          return d >= s && d <= e;
        }
        if (reportType === "monthly") {
          return (
            d.getFullYear() === Number(selectedYear) &&
            d.getMonth() === Number(selectedMonth)
          );
        }
        return false;
      })
    : [];

  // รวมยอด
  const totalPaid = filteredTransactions.reduce(
    (sum, t) => sum + Number(t.paid_amount || 0),
    0
  );

  const currencyFormat = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) =>
        row.appointment?.service?.name || row.appointment?.service || "-",
      sortable: true,
    },
    {
      name: "Amount (THB)",
      selector: (row) => Number(row.paid_amount || 0),
      sortable: true,
      right: true,
      format: (row) => currencyFormat.format(Number(row.paid_amount || 0)),
    },
    {
      name: "Date",
      selector: (row) => row.created_at,
      sortable: true,
      format: (row) =>
        new Date(
          row.created_at || row.updated_at || row.appointment?.date
        ).toLocaleString(),
    },
  ];

  const username = localStorage.getItem("name") || "Unknown User";

  return (
    <div className="table-container">
      <h4>Transaction Report</h4>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Form.Select
          style={{ width: 180 }}
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </Form.Select>

        {reportType === "daily" && (
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}

        {reportType === "monthly" && (
          <>
            <Form.Select
              style={{ width: 140 }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec",
              ].map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </Form.Select>
            <Form.Control
              style={{ width: 100 }}
              type="number"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  parseInt(e.target.value) || new Date().getFullYear()
                )
              }
            />
          </>
        )}

        <Button
          variant="secondary"
          disabled={!isFilterReady || filteredTransactions.length === 0}
          onClick={() => setShowModal(true)}
        >
          Print Report
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        title="Transactions"
        columns={columns.map((col) =>
          col.name === "ID" ? { ...col, cell: (row, index) => index + 1 } : col
        )}
        data={filteredTransactions}
        progressPending={loading}
        pagination
        responsive
        persistTableHead
        fixedHeader
        fixedHeaderScrollHeight="580px"
        noDataComponent={
          isFilterReady
            ? "No transactions found for the selected period"
            : "Please select a date or month to view transactions"
        }
      />

      {/* Print Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Transaction Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h3>Dental Clinic Transaction Report</h3>
            <p>Date Generated: {new Date().toLocaleString()}</p>
            <p>Report Type: {reportType.toUpperCase()}</p>
            <p>
              Requested by: <strong>{username}</strong>
            </p>
            <hr />
            <h4>Total Paid Amount: {currencyFormat.format(totalPaid)} THB</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionReport;
