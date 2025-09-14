import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import success_icon from "../assets/alert_success.png";
import passwordFillIcon from "../assets/iconPasswordFill.png";
import emailFillIcon from "../assets/email01.svg";
import usernameFillIcon from "../assets/iconUsernameFill.png";
import otpFillIcon from "../assets/otp_icon.svg";

const ResetPassword = ({ setShowResetPassword }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const otpRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //Start function resend OTP
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const cooldownRef = useRef(0);
  //sync ref กับ state และcountdown timer for resend OTP
  useEffect(() => {
    cooldownRef.current = cooldown;

    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const inputUsername = usernameRef.current.value.trim();
    const inputEmail = emailRef.current.value.trim();
    if (!inputUsername || !inputEmail) {
      Swal.fire("Warning", "Please fill in all fields", "warning");
      return;
    }

    if (cooldownRef.current > 0) {
      Swal.fire(
        "Warning",
        `Please wait ${cooldown} seconds to resend OTP`,
        "warning"
      );
      return;
    }

    setSendOtp(true);

    Swal.fire({
      title: "Sending OTP...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: inputEmail,
        username: inputUsername,
      });
      Swal.fire({
        html: `
          <div class="success-alert-container">
              <img src=${success_icon} alt="alert-icon" />
              <h3>Success!</h3>
              <span>${response.data.message}</span>
          </div>
          `,
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#2092D0",
        background: "#fff",
        icon: undefined,
      }).then(() => {
        setSendOtp(false);
        setEmail(inputEmail);
        setUsername(inputUsername);
        setStep(2);
        setCooldown(120); // Set cooldown to 120 seconds
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to send OTP",
        "error"
      );
    }
  };

  const handleResendOtp = async () => {
    if (cooldownRef.current > 0) {
      Swal.fire(
        "Warning",
        `Please wait ${cooldown} seconds to resend OTP`,
        "warning"
      );
      return;
    }

    setLoading(true);
    Swal.fire({
      title: "Sending OTP...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email,
        username,
      });
      Swal.fire({
        html: `
          <div class="success-alert-container">
              <img src=${success_icon} alt="alert-icon" />
              <h3>Success!</h3>
              <span>${response.data.message}</span>
          </div>
          `,
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#2092D0",
        background: "#fff",
        icon: undefined,
      });
      setCooldown(120); // Set cooldown to 120 seconds
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to resend OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otp = otpRef.current.value;
    const newPassword = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!otp || !newPassword || !confirmPassword) {
      Swal.fire("Warning", "Please fill in all fields", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords not match", "error");
      return;
    }

    setResetPassword(true);
    Swal.fire({
      title: "Resetting Password...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        otp,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });

      Swal.fire({
        html: `
          <div class="success-alert-container">
              <img src=${success_icon} alt="alert-icon" />
              <h3>Success!</h3>
              <span>Password reset successful!</span>
          </div>
          `,
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#2092D0",
        background: "#fff",
        icon: undefined,
      }).then(() => {
        setResetPassword(false);
        setShowResetPassword(false);
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Password reset failed",
        "error"
      ).then(() => {
        setResetPassword(false);
      });
    }
  };

  return (
    <div className="form-login-container">
      <div className="form-header">
        <h3>RESET PASSWORD</h3>
      </div>

      <form className="form-login">
        {step === 1 && (
          <>
            <div className="form-input-login mb-2">
              <img src={usernameFillIcon} alt="usernameFillIcon" />
              <input
                type="text"
                ref={usernameRef}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-input-login mb-3">
              <img src={emailFillIcon} alt="emailFillIcon" />
              <input
                type="email"
                ref={emailRef}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="btn-group-section-login">
              <button
                type="submit"
                className="btn-submit-resetpassword"
                onClick={handleSendOtp}
              >
                {sendOtp ? "Send OTP" : "Send OTP"}
              </button>
              <button
                type="submit"
                className="btn-cancel-resetpassword"
                onClick={() => setShowResetPassword(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-input-login mb-1">
              <img src={otpFillIcon} alt="passwordFillIcon" />
              <input
                type="text"
                ref={otpRef}
                placeholder="Enter OTP"
                required
              />
            </div>
            <div
              className="btn-resend-otp mb-3"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || loading}
            >
              {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
            </div>
            <div className="form-input-login mb-3">
              <img src={passwordFillIcon} alt="passwordFillIcon" />
              <input
                className="input-password"
                type={showPassword ? "text" : "password"}
                name="password"
                ref={passwordRef}
                placeholder="New password"
                required
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
            <div className="form-input-login">
              <img src={passwordFillIcon} alt="passwordFillIcon" />
              <input
                className="input-password"
                type={showConfirmPassword ? "text" : "password"}
                ref={confirmPasswordRef}
                placeholder="Confirm New password"
                required
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
            <div className="validate-password mb-3">
              The password must be 8-16 characters long and contain at least one
              uppercase, one lowercase, one number, and one special character.
            </div>
            <div className="btn-group-section-login">
              <button
                type="submit"
                className="btn-submit-resetpassword"
                onClick={handleResetPassword}
              >
                {resetPassword ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
export default ResetPassword;
