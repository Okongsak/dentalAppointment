import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

const Dashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes, transactionsRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/getpatients`),
            axios.get(`${API_BASE_URL}/getAppointments`),
            axios.get(`${API_BASE_URL}/transactions`),
          ]);

        const patients = patientsRes.data;
        const appointments = appointmentsRes.data;
        const transactions = transactionsRes.data;
        console.log("data=", transactions);

        // วันนี้
        const today = new Date().toISOString().split("T")[0];

        // จำนวนคนไข้ทั้งหมด
        const totalPatients = patients.length;

        // นัดหมายวันนี้
        const todayAppointments = appointments.filter(
          (appt) => appt.date === today
        ).length;

        // รายได้ทั้งหมด
        const totalRevenue = transactions.reduce(
          (sum, t) => sum + (parseFloat(t.paid_amount) || 0),
          0
        );

        // รายได้วันนี้
        const todayRevenue = transactions
          .filter((t) => t.created_at.split("T")[0] === today) // เอาวันจาก created_at
          .reduce((sum, t) => sum + (parseFloat(t.paid_amount) || 0), 0);

        setStats({
          totalPatients,
          todayAppointments,
          totalRevenue,
          todayRevenue,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  return (
    <div className="container dashboard-container">
      <div className="row g-4">
        <div className="col-md-6 col-12">
          <div className="card-dashboard card-blue">
            <h2><FaUser /> Total Patients</h2>
            <p>{stats.totalPatients}</p>
          </div>
        </div>

        <div className="col-md-6 col-12">
          <div className="card-dashboard card-green">
            <h2><FaCalendarCheck /> Appointments Today</h2>
            <p>{stats.todayAppointments}</p>
          </div>
        </div>

        <div className="col-md-6 col-12">
          <div className="card-dashboard card-purple">
            <h2><FaMoneyBillWave /> Total Revenue</h2>
            <p>฿{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="col-md-6 col-12">
          <div className="card-dashboard card-red">
            <h2><FaChartLine /> Revenue Today</h2>
            <p>฿{stats.todayRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
