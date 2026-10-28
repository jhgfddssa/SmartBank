import { useState } from "react";
import axios from "axios";
import "./AdminAuditLog.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminAuditLog() {
  // ==============================
  // STATE
  // ==============================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState(null);

  // ==============================
  // LOAD AUDIT LOGS
  // ==============================
  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/admin/audit-logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(response.data);
    } catch (error) {
      console.error("Audit Log Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FILTER LOGS
  // ==============================
  const filteredLogs =
    selectedAction === "ALL"
      ? logs
      : logs.filter((log) => log.action === selectedAction);

  // ==============================
  // STATISTICS
  // ==============================
  const freezeCount = logs.filter(
    (log) =>
      log.action === "FREEZE_ACCOUNT" ||
      log.action === "UNFREEZE_ACCOUNT"
  ).length;

  const loanCount = logs.filter(
    (log) =>
      log.action === "APPROVE_LOAN" ||
      log.action === "REJECT_LOAN"
  ).length;

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="admin-audit-container">

      {/* ==============================
          HEADER
      ============================== */}
      <div className="admin-audit-header">
        <div>
          <h1>🔐 Admin Audit Logs</h1>

          <p>
            Track all important administrator activities
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadLogs}
          disabled={loading}
        >
          {loading ? "Loading..." : "🔄 Load Logs"}
        </button>
      </div>

      {/* ==============================
          STATISTICS
      ============================== */}
      <div className="audit-stats">

        <div className="audit-stat-card">
          <span>Total Activities</span>
          <h2>{logs.length}</h2>
        </div>

        <div className="audit-stat-card">
          <span>Account Actions</span>
          <h2>{freezeCount}</h2>
        </div>

        <div className="audit-stat-card">
          <span>Loan Actions</span>
          <h2>{loanCount}</h2>
        </div>

      </div>

      {/* ==============================
          FILTER
      ============================== */}
      <div className="audit-filter">
        <label>Action Filter:</label>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="ALL">All Actions</option>

          <option value="FREEZE_ACCOUNT">
            Freeze Account
          </option>

          <option value="UNFREEZE_ACCOUNT">
            Unfreeze Account
          </option>

          <option value="APPROVE_LOAN">
            Approve Loan
          </option>

          <option value="REJECT_LOAN">
            Reject Loan
          </option>
        </select>
      </div>

      {/* ==============================
          ERROR
      ============================== */}
      {error && (
        <div className="audit-error">
          {error}
        </div>
      )}

      {/* ==============================
          TABLE
      ============================== */}
      <div className="audit-table-container">

        {logs.length === 0 && !loading && (
          <div className="audit-empty">
            <p>No audit logs loaded yet.</p>

            <button onClick={loadLogs}>
              Load Audit Logs
            </button>
          </div>
        )}

        {loading && (
          <p className="audit-loading">
            Loading audit logs...
          </p>
        )}

        {!loading && filteredLogs.length > 0 && (
          <table className="audit-table">

            <thead>
              <tr>
                <th>Action</th>
                <th>Admin</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>

                  <td>
                    <span
                      className={`audit-action ${log.action.toLowerCase()}`}
                    >
                      {log.action.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    {log.admin?.name || "Unknown"}
                  </td>

                  <td>
                    {log.targetUser?.name || "N/A"}
                  </td>

                  <td>
                    {log.description}
                  </td>

                  <td>
                    {formatDate(log.createdAt)}
                  </td>

                  <td>
                    <button
                      className="audit-details-btn"
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

      {/* ==============================
          DETAILS MODAL
      ============================== */}
      {selectedLog && (
        <div
          className="audit-modal-overlay"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="audit-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="audit-modal-header">
              <div>
                <h2>Audit Log Details</h2>

                <p>
                  Complete administrator activity information
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </button>
            </div>

            <div className="audit-details">

              <div className="audit-detail-item">
                <span>Action</span>

                <strong>
                  {selectedLog.action.replaceAll("_", " ")}
                </strong>
              </div>

              <div className="audit-detail-item">
                <span>Admin</span>

                <strong>
                  {selectedLog.admin?.name}
                </strong>

                <small>
                  {selectedLog.admin?.email}
                </small>
              </div>

              <div className="audit-detail-item">
                <span>Customer</span>

                <strong>
                  {selectedLog.targetUser?.name || "N/A"}
                </strong>

                <small>
                  Account:{" "}
                  {selectedLog.targetUser?.accountNumber || "N/A"}
                </small>
              </div>

              {/* SHOW LOAN ONLY IF IT EXISTS */}
              {selectedLog.targetLoan && (
                <>
                  <div className="audit-detail-item">
                    <span>Loan Amount</span>

                    <strong>
                      $
                      {Number(
                        selectedLog.targetLoan.amount
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div className="audit-detail-item">
                    <span>Loan Purpose</span>

                    <strong>
                      {selectedLog.targetLoan.purpose}
                    </strong>
                  </div>

                  <div className="audit-detail-item">
                    <span>Loan Status</span>

                    <strong>
                      {selectedLog.targetLoan.status}
                    </strong>
                  </div>
                </>
              )}

              <div className="audit-detail-item">
                <span>Description</span>

                <strong>
                  {selectedLog.description}
                </strong>
              </div>

              <div className="audit-detail-item">
                <span>Date</span>

                <strong>
                  {formatDate(selectedLog.createdAt)}
                </strong>
              </div>

            </div>

            <div className="audit-modal-footer">

              <button
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminAuditLog;