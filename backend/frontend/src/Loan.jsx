import { useState } from "react";
import axios from "axios";

function Loan({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (Number(amount) <= 0) {
      setError("Loan amount must be greater than 0");
      return;
    }

    if (Number(duration) <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/loans/apply",
        {
          amount: Number(amount),
          purpose,
          duration: Number(duration),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Loan application successful:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Loan application submitted successfully!"
      );

      setAmount("");
      setPurpose("");
      setDuration("");

      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Loan application failed"
        );
      } else {
        setError("Cannot connect to server");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-overlay">
      <div className="transfer-card">

        <h2>🏦 Apply for Loan</h2>

        <p className="transfer-subtitle">
          Submit your loan application
        </p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleApply}>

          {/* Loan Amount */}
          <div className="form-group">
            <label>Loan Amount</label>

            <input
              type="number"
              placeholder="Enter loan amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              min="1"
              step="0.01"
              required
            />
          </div>

          {/* Purpose */}
          <div className="form-group">
            <label>Purpose</label>

            <input
              type="text"
              placeholder="What is the purpose of the loan?"
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              required
            />
          </div>

          {/* Duration */}
          <div className="form-group">
            <label>Duration (Months)</label>

            <input
              type="number"
              placeholder="Enter duration in months"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              min="1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="transfer-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Apply Now"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Loan;