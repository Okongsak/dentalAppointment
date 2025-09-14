import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import bgLogin from "../assets/loginBG.svg";
import passwordFillIcon from "../assets/iconPasswordFill.png";
import usernameFillIcon from "../assets/iconUsernameFill.png";
import { useAuth } from "./useAuth.jsx";
import CreateAccount from "./createAccount.jsx";

const AuthForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { login, isLoggedIn } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      name: nameRef.current.value,
      password: passwordRef.current.value,
    };

    setLoggingIn(true);
    Swal.fire({
      title: "Logging...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginData);
      const { token, name } = response.data;

      if (token) {
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);

        await login(token);
        setTimeout(() => {
          setLoggingIn(true);
          Swal.close();

          Swal.fire({
            icon: "success",
            title: `Welcome back, ${name}!`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
            position: "center",
          });

          navigate("/dashboard");
        }, 100);
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      Swal.fire({
        title: "Login Failed!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  if (isLoggedIn) return null; // ถ้า logged in แล้วไม่ต้อง render login form

  return (
    <div className="bg-login">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-7 col-12 d-grid align-items-center">
            <div className="form-login-container">
              <div className="form-header">
                <h4>Login</h4>
              </div>
              <form className="form-login" onSubmit={handleLogin}>
                <div className="form-input-login mb-3">
                  <img src={usernameFillIcon} alt="nameFillIcon" />
                  <input
                    type="text"
                    ref={nameRef}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="form-input-login mb-1">
                  <img src={passwordFillIcon} alt="passwordFillIcon" />
                  <input
                    className="input-password"
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    placeholder="Password"
                    required
                  />
                  <span
                    className="toggle-password-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </span>
                </div>
                <div className="btn-group-section-login">
                  <button className="btn-submit-login my-3" type="submit">
                    {loggingIn ? "Logging" : "Login"}
                  </button>
                </div>
              </form>
              <CreateAccount />
            </div>
          </div>
          <div className="col-md-5 col-12 d-grid align-items-center">
            <div className="cover-login">
              <img src={bgLogin} alt="bgLogin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
