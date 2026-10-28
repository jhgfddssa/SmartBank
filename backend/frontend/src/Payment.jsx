import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Payment({ onClose, onSuccess }) {
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check amount
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // Send payment request to Backend
      const response = await axios.post(
  `${API_URL}/api/transactions/payment`,
        {
          merchant,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment successful:", response.data);

      // Show success message
      setMessage(
        response.data.message || "Payment successful!"
      );

      // Clear form
      setMerchant("");
      setAmount("");

      // Send result back to Dashboard
      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Payment failed"
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

        <h2>💳 Make Payment</h2>

        <p className="transfer-subtitle">
          Pay for products or services
        </p>

        {/* Success Message */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment}>

          {/* Merchant */}
          <div className="form-group">
            <label>Merchant Name</label>

            <input
              type="text"
              placeholder="Enter merchant name"
              value={merchant}
              onChange={(e) =>
                setMerchant(e.target.value)
              }
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              min="1"
              step="0.01"
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
                ? "Processing..."
                : "Pay Now"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Payment;