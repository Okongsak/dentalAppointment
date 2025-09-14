import { useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { IoKeySharp, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import success_icon from "../assets/alert_success.png";
import passwordFillIcon from "../assets/iconPasswordFill.png";
import { useAuth } from "../auth/useAuth";

const ChangePassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showModalChangePassword, setShowModalChangePassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const { token } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowModalChangePassword = () => {
    setShowModalChangePassword(true);
  };

  const handleCloseModalChangePassword = () => {
    setShowModalChangePassword(false);
  };

  /* reset password */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const resetData = {
      username: localStorage.getItem("username"),
      new_password: passwordRef.current.value,
    };
    const confirmNewPassword = confirmPasswordRef.current.value;

    if (!resetData.new_password || !confirmNewPassword) {
      Swal.fire("Warning", "Please fill in all fields", "warning");
      return;
    }

    if (resetData.new_password !== confirmNewPassword) {
      Swal.fire("Error", "Passwords not match", "error");
      return;
    }

    setChangePassword(true);
    Swal.fire({
      title: "Changing Password...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post(
        `${API_BASE_URL}/change-password`,
        {
          ...resetData,
          confirm_new_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        html: `
        <div class="success-alert-container">
            <img src=${success_icon} alt="alert-icon" />
            <h3>Success!</h3>
            <span>Password has been change.</span>
        </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "Done",
        confirmButtonColor: "#2092D0",
        background: "#fff",
        icon: undefined,
      }).then(() => {
        setChangePassword(false);
        handleCloseModalChangePassword();
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Password reset failed",
        "error"
      ).then(() => {
        setChangePassword(false);
      });
    }
  };

  return (
    <>
      <button
        className="btn-change-password"
        type="button"
        onClick={handleShowModalChangePassword}
      >
        <IoKeySharp /> Change Password
      </button>
      <Modal
        show={showModalChangePassword}
        onHide={handleCloseModalChangePassword}
        backdrop="static"
        keyboard={false}
        centered
      >
        <div className="bg-modal-create-folder">
          <Modal.Header closeButton>
            <Modal.Title className="create-folder-header">
              CHANGE PASSWORD
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-change-password-container">
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
              <div className="validate-password mb-4">
                The password must be 8-16 characters long and contain at least
                one uppercase, one lowercase, one number, and one special
                character.
              </div>
              <div className="btn-group-section-change-password">
                <button
                  type="submit"
                  className="btn-submit-change-password"
                  onClick={handleChangePassword}
                >
                  {changePassword ? "Changing password..." : "Change password"}
                </button>
                <button
                  className="btn-cancel-change-password"
                  type="button"
                  onClick={handleCloseModalChangePassword}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default ChangePassword;
