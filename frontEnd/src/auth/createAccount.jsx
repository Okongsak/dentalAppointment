import axios from "axios";
import Swal from "sweetalert2";
import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import passwordFillIcon from "../assets/iconPasswordFill.png";
import usernameFillIcon from "../assets/iconUsernameFill.png";
import emailFillIcon from "../assets/email01.svg";

const CreateAccount = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showModalCreateAccount, setShowModalCreateAccount] = useState(false);
  const formRef = useRef(null);

  const handleCloseModalCreateAccount = () => {
    setShowModalCreateAccount(false);
  };

  const handleShowModalCreateAccount = () => {
    setShowModalCreateAccount(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"), // เพิ่ม email
      password: formData.get("password"),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);

      if (response.data.message) {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          e.target.reset();
          handleCloseModalCreateAccount();
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);

      let errorMessage = "Something went wrong!";

      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        if (errors.name) {
          errorMessage = errors.name[0];
        } else if (errors.email) {
          errorMessage = errors.email[0];
        } else if (errors.password) {
          errorMessage = errors.password[0];
        } else {
          errorMessage = Object.values(errors).flat().join("\n");
        }
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      Swal.fire({
        title: "Signup Failed!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <>
      <button
        className="btn-create-account"
        type="button"
        onClick={handleShowModalCreateAccount}
      >
        <FaPlus className="me-1" />
        Create Account
      </button>
      <Modal
        show={showModalCreateAccount}
        onHide={handleCloseModalCreateAccount}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="create-account-header">
            Create Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="create-account-container">
            <form onSubmit={handleSignup} ref={formRef}>
              <div className="form-input-signup mb-3">
                <img
                  className="fill-icon"
                  src={usernameFillIcon}
                  alt="nameFillIcon"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                />
              </div>
              <div className="form-input-signup mb-3">
                <img
                  className="fill-icon"
                  src={emailFillIcon}
                  alt="emailFillIcon"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-input-signup mb-3">
                <img
                  className="password-fill-icon"
                  src={passwordFillIcon}
                  alt="passwordFillIcon"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="btn-group-signup">
                <button
                  type="button"
                  className="btn-cancel-signup"
                  onClick={handleCloseModalCreateAccount}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-signup">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateAccount;
