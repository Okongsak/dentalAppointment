import "./App.css";
import { Routes, Route } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import { AuthProvider } from "./auth/authContext.jsx";
import ProtectedRoute from "./auth/protectedRoute.jsx";
import IndexPage from "./pages/index.jsx";
import NavBar from "./components/navBar.jsx";
import Footer from "./components/footer.jsx";
import IndexAdmnin from "./pages/indexAdmin.jsx";
import AuthForm from "./auth/login.jsx";

function App() {
  return (
    <AuthProvider>
      <div>
        <NavBar />
        <StyleSheetManager shouldForwardProp={(prop) => prop !== "align"}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/admin" element={<AuthForm />} />

            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<IndexAdmnin />} />
            </Route>
          </Routes>
        </StyleSheetManager>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
