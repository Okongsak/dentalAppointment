import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    // ระหว่างที่ตรวจสอบสถานะไม่ให้แสดงอะไร
    return null;
  }

  // เช็ค token ใน localStorage
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    Swal.fire({
      title: "Access Denied",
      text: "You must be logged in to access this page.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return <Navigate to="/admin" replace />;
  }

  // ถ้าล็อกอินแล้ว อยู่ที่ "/" ให้ไป "/dashboard"
  if (location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  // ถ้าผู้ใช้ไม่ได้ล็อกอินและไม่อยู่ที่หน้า login
  return <Outlet />;
};

export default ProtectedRoute;
