import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import navLogo from "../assets/navLogo.jpg";
import { useAuth } from "../auth/useAuth.jsx";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
    window.location.reload();
  };

  return (
    <Navbar bg="light" data-bs-theme="light" className="px-3">
      <Container>
        <Navbar.Brand>
          <img src={navLogo} alt="navlogo" height={40} />
        </Navbar.Brand>

        {isLoggedIn && (
          <div className="ms-auto">
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <IoLogOut className="me-1" />
              Logout
            </button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
