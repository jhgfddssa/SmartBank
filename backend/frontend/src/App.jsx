import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

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

      console.log("Login successful:", response.data);

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Login successful
      setLoggedIn(true);

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show Dashboard
  if (loggedIn) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <Dashboard />;
}

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo">
          🏦
        </div>

        <h1>SmartBank</h1>

        <p className="subtitle">
          Welcome back
        </p>

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
          <span>Register</span>
        </p>

      </div>
    </div>
  );
}

export default App;