
import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import Register from "./Register";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is already logged in
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
          "Login failed. Please check your email and password."
        );
      } else {
        setError("Cannot connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show Dashboard if already logged in
  if (loggedIn) {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (user?.role === "admin") {
      return <AdminDashboard />;
    }

    return <Dashboard />;
  }

  // Show Register page
  if (showRegister) {
    return (
      <Register
        onBackToLogin={() => {
          setShowRegister(false);
          setError("");
        }}
      />
    );
  }

  // Show Login page
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">🏦</div>

        <h1>SmartBank</h1>

        <p className="subtitle">Welcome back</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setShowRegister(true);
              setError("");
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
