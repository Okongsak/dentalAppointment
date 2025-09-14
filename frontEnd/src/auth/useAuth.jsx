import { createContext, useContext } from "react";

export const AuthContext = createContext(); // สร้าง context ชื่อ AuthContext

export const useAuth = () => {
  return useContext(AuthContext); // สร้าง custom hook ใช้ context ง่ายๆ
};