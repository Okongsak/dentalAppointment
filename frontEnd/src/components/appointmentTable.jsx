import { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import moment from "moment";

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);

  const getAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getAppointments`, {
        params: { date: selectedDate },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, selectedDate]);

  useEffect(() => {
    getAppointments();
  }, [getAppointments]);

  const formatDateTime = (date, time) => {
    return moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").format(
      "DD-MM-YYYY HH:mm"
    );
  };

  const statusMap = { 0: "Pending", 1: "Confirm", 2: "Cancel" };

  // เปลี่ยนสถานะ
  const updateStatus = async (id, newStatus) => {
    const target = appointments.find((item) => item.id === id);
    if (!target) return;

    if (String(target.status) === String(newStatus)) return;

    const confirmChange = window.confirm(
      `เปลี่ยนสถานะจาก "${statusMap[target.status]}" → "${
        statusMap[newStatus]
      }" ?`
    );

    if (!confirmChange) return;

    try {
      await axios.patch(`${API_BASE_URL}/appointments/${id}/status`, {
        status: newStatus,
      });
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: Number(newStatus) } : item
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Name", selector: (row) => row.name, sortable: true, wrap: true },
    { name: "Phone", selector: (row) => row.phone, wrap: true },
    {
      name: "Date & Time",
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => formatDateTime(row.date, row.time),
    },
    { name: "Service", selector: (row) => row.service, wrap: true },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <select
          className="select-status"
          value={row.status}
          onChange={(e) => updateStatus(row.id, e.target.value)}
        >
          <option value="0">Pending</option>
          <option value="1">Confirm</option>
          <option value="2">Cancel</option>
        </select>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="table-container">
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border mx-2 px-2 py-1 rounded"
        />
      </div>

      <DataTable
        title="Appointments"
        columns={columns.map((col) =>
          col.name === "ID" ? { ...col, cell: (row, index) => index + 1 } : col
        )}
        data={appointments}
        progressPending={loading}
        pagination
        responsive
        persistTableHead
        defaultSortFieldId="id"
        defaultSortAsc={true}
        fixedHeader
        fixedHeaderScrollHeight="580px"
      />
    </div>
  );
};

export default AppointmentsTable;
