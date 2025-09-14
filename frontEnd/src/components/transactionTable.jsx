import { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Form, Modal } from "react-bootstrap";

const TransactionTable = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [paymentInput, setPaymentInput] = useState({
    amount: "",
    payment_type: "",
  });

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/transactions?status=confirm`
      );
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

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setPaymentInput({
      amount: transaction.paid_amount || "",
      payment_type: transaction.payment_type?.toString() || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setPaymentInput({ amount: "", payment_type: "" });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInput((prev) => ({ ...prev, [name]: value }));
  };

  const savePayment = async () => {
    const { amount, payment_type } = paymentInput;

    if (!amount || !payment_type) {
      Swal.fire("Error", "Both amount and payment type are required", "error");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/updatetransactions/${editingTransaction.id}`,
        {
          paid_amount: parseFloat(amount),
          payment_type: parseInt(payment_type),
        }
      );

      Swal.fire("Success", "Payment updated successfully", "success");
      closeModal();
      fetchTransactions();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save payment", "error");
    }
  };

  // state สำหรับใบเสร็จ
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptTransaction, setReceiptTransaction] = useState(null);

  // ฟังก์ชันเปิด modal ใบเสร็จ
  const openReceiptModal = (transaction) => {
    setReceiptTransaction(transaction);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setReceiptTransaction(null);
  };

  // state สำหรับ search
  const [filterText, setFilterText] = useState("");

  // ฟังก์ชันกรอง transactions
  const filteredTransactions = transactions.filter((t) => {
    const name = t.appointment.name.toLowerCase();
    const phone = t.appointment.phone.toLowerCase();
    const search = filterText.toLowerCase();
    return name.includes(search) || phone.includes(search);
  });

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Name", selector: (row) => row.appointment.name, sortable: true },
    { name: "Phone", selector: (row) => row.appointment.phone },
    { name: "Service", selector: (row) => row.appointment.service },
    { name: "Amount", selector: (row) => row.paid_amount },
    {
      name: "Payment Type",
      selector: (row) => {
        switch (row.payment_type) {
          case 0:
            return "Not Paid";
          case 1:
            return "Cash";
          case 2:
            return "Bank Transfer";
          case 3:
            return "QR Scan";
          case 4:
            return "Credit Card";
          default:
            return "-";
        }
      },
      cell: (row) => {
        if (row.payment_type === 0) return "Not Paid";

        const typeMap = {
          1: "Cash",
          2: "Bank Transfer",
          3: "QR Scan",
          4: "Credit Card",
        };

        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => openReceiptModal(row)}
          >
            {typeMap[row.payment_type]}
          </Button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <Button size="sm" variant="success" onClick={() => openEditModal(row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="table-container">
      <div className="row">
        <div className="col-md-4 mb-3">
          <Form.Control
            type="text"
            placeholder="Search by Name or Phone"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

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
      />

      {/* Edit Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={paymentInput.amount}
                onChange={handlePaymentChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Type</Form.Label>
              <Form.Select
                name="payment_type"
                value={paymentInput.payment_type}
                onChange={handlePaymentChange}
              >
                <option value="">Select Type</option>
                <option value="1">Cash</option>
                <option value="2">Bank Transfer</option>
                <option value="3">QR Scan</option>
                <option value="4">Credit Card</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={savePayment}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Receipt Modal */}
      <Modal show={showReceiptModal} onHide={closeReceiptModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {receiptTransaction && (
            <div className="receipt-container">
              <h4 className="receipt-header">
                Dental Clinic Receipt
              </h4>
              <hr />
              <p>
                <strong>Transaction ID:</strong> {receiptTransaction.id}
              </p>
              <p>
                <strong>Name:</strong> {receiptTransaction.appointment.name}
              </p>
              <p>
                <strong>Phone:</strong> {receiptTransaction.appointment.phone}
              </p>
              <p>
                <strong>Service:</strong>{" "}
                {receiptTransaction.appointment.service}
              </p>
              <p>
                <strong>Amount Paid:</strong> {receiptTransaction.paid_amount} <strong>THB.</strong>
              </p>
              <p>
                <strong>Payment Type:</strong>{" "}
                {(() => {
                  const map = {
                    1: "Cash",
                    2: "Bank Transfer",
                    3: "QR Scan",
                    4: "Credit Card",
                  };
                  return map[receiptTransaction.payment_type];
                })()}
              </p>
              <hr />
              <p className="receipt-bottom">
                Thank you for your payment!
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TransactionTable;
