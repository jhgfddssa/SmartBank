
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Register({ onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { name, email, password }
      );

      setMessage(
        response.data.message || "Registration successful! Please log in."
      );

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">🏦</div>
        <h1>SmartBank</h1>
        <p className="subtitle">Create your account</p>

        {message && (
          <div className="success-message">{message}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <button type="button" onClick={onBackToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
