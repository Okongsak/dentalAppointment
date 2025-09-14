import { useState } from "react";
import Dashboard from "../components/dashboard.jsx";
import AppointmentTable from "../components/appointmentTable.jsx";
import PatientList from "../components/patientList.jsx";
import TransactionTable from "../components/transactionTable.jsx";
import { AiFillDashboard } from "react-icons/ai";
import { FaCalendarCheck, FaUsers } from "react-icons/fa";
import { TbTransactionBitcoin } from "react-icons/tb";

const IndexAdmin = () => {
  // state เก็บเมนูที่เลือก
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // กำหนดเมนูทั้งหมด (เก็บทั้งชื่อและ icon)
  const menuItems = [
    { name: "Dashboard", icon: <AiFillDashboard /> },
    { name: "Appointment", icon: <FaCalendarCheck /> },
    { name: "Patient list", icon: <FaUsers /> },
    { name: "Transaction", icon: <TbTransactionBitcoin /> },
  ];

  return (
    <div className="container">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2">
          <div className="side-menu-container">
            <ul>
              {menuItems.map((menu) => (
                <li key={menu.name}>
                  <span
                    style={{
                      cursor: "pointer",
                      fontWeight: activeMenu === menu.name ? "bold" : "normal",
                      color: activeMenu === menu.name ? "#007bff" : "#000",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onClick={() => setActiveMenu(menu.name)}
                  >
                    {menu.icon} {menu.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-10">
          <div className="element-container">
            {activeMenu === "Dashboard" && <div><Dashboard /></div>}
            {activeMenu === "Appointment" && <AppointmentTable />}
            {activeMenu === "Patient list" && <div><PatientList /></div>}
            {activeMenu === "Transaction" && <div><TransactionTable /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexAdmin;
