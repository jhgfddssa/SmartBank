import { useState } from "react";
import axios from "axios";
import "./AdminLoan.css";
const API_URL = import.meta.env.VITE_API_URL;

function AdminLoan() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // LOAD ALL LOANS
  // ============================================
  const loadLoans = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/admin/loans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Admin Loans:", response.data);

      setLoans(response.data);
      setLoaded(true);
    } catch (error) {
      console.error("Load loans error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to load loans"
        );
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // APPROVE LOAN
  // ============================================
  const handleApprove = async (loanId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this loan?"
    );

    if (!confirmApprove) {
      return;
    }

    try {
      setProcessingId(loanId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/admin/loans/${loanId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Loan approved:", response.data);

      setSuccess(
        response.data.message ||
          "Loan approved successfully"
      );

      await loadLoans();
    } catch (error) {
      console.error("Approve loan error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to approve loan"
        );
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================
  // REJECT LOAN
  // ============================================
  const handleReject = async (loanId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this loan?"
    );

    if (!confirmReject) {
      return;
    }

    try {
      setProcessingId(loanId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/admin/loans/${loanId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Loan rejected:", response.data);

      setSuccess(
        response.data.message ||
          "Loan rejected successfully"
      );

      await loadLoans();
    } catch (error) {
      console.error("Reject loan error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to reject loan"
        );
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================
  // FORMAT STATUS
  // ============================================
  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // ============================================
  // STATUS CLASS
  // ============================================
  const getStatusClass = (status) => {
    if (status === "approved") {
      return "status-approved";
    }

    if (status === "rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="admin-loans">

      {/* HEADER */}
      <div className="admin-loans-header">
        <div>
          <h2>🏦 Loan Applications</h2>

          <p>
            Review and manage customer loan
            applications.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadLoans}
          disabled={loading}
        >
          🔄{" "}
          {loading
            ? "Loading..."
            : "Load / Refresh"}
        </button>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="success-message">
          ✅ {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* FIRST LOAD */}
      {!loaded && !loading && (
        <div className="load-loans-message">
          <h3>📋 Loan Management</h3>

          <p>
            Click the button below to load
            customer loan applications.
          </p>

          <button
            className="load-button"
            onClick={loadLoans}
          >
            📥 Load Loan Applications
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="loading-message">
          <p>
            ⏳ Loading loan applications...
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        loaded &&
        loans.length === 0 && (
          <div className="empty-message">
            <h3>
              📄 No Loan Applications
            </h3>

            <p>
              There are no loan applications
              yet.
            </p>
          </div>
        )}

      {/* LOAN LIST */}
      {!loading &&
        loaded &&
        loans.length > 0 && (
          <div className="loan-list">

            {loans.map((loan) => (
              <div
                className="loan-item"
                key={loan._id}
              >

                {/* CUSTOMER */}
                <div className="loan-customer">

                  <h3>
                    👤{" "}
                    {loan.user?.name ||
                      "Unknown Customer"}
                  </h3>

                  <p>
                    <strong>
                      Account:
                    </strong>{" "}
                    {loan.user
                      ?.accountNumber ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {loan.user?.email ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>
                      Current Balance:
                    </strong>{" "}
                    $
                    {Number(
                      loan.user?.balance ||
                        0
                    ).toLocaleString()}
                  </p>

                </div>

                {/* LOAN INFO */}
                <div className="loan-info">

                  <p>
                    <strong>
                      Amount:
                    </strong>{" "}
                    $
                    {Number(
                      loan.amount || 0
                    ).toLocaleString()}
                  </p>

                  <p>
                    <strong>
                      Purpose:
                    </strong>{" "}
                    {loan.purpose ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>
                      Duration:
                    </strong>{" "}
                    {loan.duration || 0}{" "}
                    Months
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}

                    <span
                      className={getStatusClass(
                        loan.status
                      )}
                    >
                      {formatStatus(
                        loan.status
                      )}
                    </span>
                  </p>

                  <p>
                    <strong>
                      Application ID:
                    </strong>{" "}
                    {loan._id}
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{" "}
                    {loan.createdAt
                      ? new Date(
                          loan.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                </div>

                {/* ACTIONS */}
                {loan.status ===
                  "pending" && (
                  <div className="loan-actions">

                    <button
                      className="approve-button"
                      onClick={() =>
                        handleApprove(
                          loan._id
                        )
                      }
                      disabled={
                        processingId ===
                        loan._id
                      }
                    >
                      {processingId ===
                      loan._id
                        ? "Processing..."
                        : "✅ Approve"}
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        handleReject(
                          loan._id
                        )
                      }
                      disabled={
                        processingId ===
                        loan._id
                      }
                    >
                      {processingId ===
                      loan._id
                        ? "Processing..."
                        : "❌ Reject"}
                    </button>

                  </div>
                )}

                {/* PROCESSED */}
                {loan.status !==
                  "pending" && (
                  <div className="processed-label">

                    {loan.status ===
                    "approved"
                      ? "✅ Loan Approved"
                      : "❌ Loan Rejected"}

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

    </div>
  );
}

export default AdminLoan;