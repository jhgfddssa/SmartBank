import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Transfer({ onClose, onSuccess }) {
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
  `${API_URL}/api/transactions/transfer`,
  {
    receiverAccount,
    amount: Number(amount),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log("Transfer successful:", response.data);

      setMessage(
        response.data.message || "Transfer successful!"
      );

      setReceiverAccount("");
      setAmount("");

      // Refresh dashboard data
      if (onSuccess) {
  onSuccess(response.data);
}

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Transfer failed"
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

        <h2>💸 Transfer Money</h2>

        <p className="transfer-subtitle">
          Send money to another SmartBank account
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

        <form onSubmit={handleTransfer}>

          <div className="form-group">
            <label>Receiver Account Number</label>

            <input
              type="text"
              placeholder="Enter account number"
              value={receiverAccount}
              onChange={(e) =>
                setReceiverAccount(e.target.value)
              }
              required
            />
          </div>

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
                ? "Transferring..."
                : "Transfer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Transfer;