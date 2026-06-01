import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useCallback } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SingleLinePage from "./pages/SingleLinePage";
import MultiLineTelemetryPage from "./pages/MultiLineTelemetryPage";
import DetailsPage from "./pages/DetailsPage";
import "./App.css";

// Protects routes from unauthenticated access
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// Handles login logic and error state
function LoginWrapper() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Memoize handleLogin to avoid unnecessary re-renders
  const handleLogin = useCallback(
    (username, password) => {
      // If username and password are non-empty, treat as backend success
      if (username && password) {
        setError("");
        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    },
    [navigate],
  );

  return <LoginPage onLogin={handleLogin} error={error} />;
}

// Optional: Logout component for demonstration
function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username"); // Remove username on logout
    navigate("/login");
  };
  return (
    <button
      onClick={handleLogout}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        margin: "0 auto -4px",
      }}
    >
      Logout
    </button>
  );
}

function App() {
  return (
    <Router>
      {/* Optionally show logout button if logged in */}
      {localStorage.getItem("isLoggedIn") === "true" && <LogoutButton />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/single-line"
          element={
            <ProtectedRoute>
              <SingleLinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/multi-line"
          element={
            <ProtectedRoute>
              <MultiLineTelemetryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details"
          element={
            <ProtectedRoute>
              <DetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
