import { useState } from "react";
import axios from "axios";
import "./AdminCustomer.css";

function AdminCustomer() {
  // ========================================
  // CUSTOMER STATES
  // ========================================

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  // Selected customer for details modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // ========================================
  // TRANSACTION STATES
  // ========================================

  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  // ========================================
  // LOAD CUSTOMERS
  // ========================================

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data);
      setLoaded(true);
    } catch (error) {
      console.error("Customer Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FREEZE CUSTOMER
  // ========================================

  const handleFreeze = async (accountNumber) => {
    const confirmed = window.confirm(
      `Are you sure you want to freeze account ${accountNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/freeze/${accountNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Account frozen successfully.");

      await loadCustomers();
    } catch (error) {
      console.error("Freeze Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to freeze account"
      );
    }
  };

  // ========================================
  // UNFREEZE CUSTOMER
  // ========================================

  const handleUnfreeze = async (accountNumber) => {
    const confirmed = window.confirm(
      `Are you sure you want to unfreeze account ${accountNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/unfreeze/${accountNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Account unfrozen successfully.");

      await loadCustomers();
    } catch (error) {
      console.error("Unfreeze Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to unfreeze account"
      );
    }
  };

  // ========================================
  // LOAD CUSTOMER TRANSACTIONS
  // ========================================

  const loadCustomerTransactions = async (accountNumber) => {
    try {
      setTransactionLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/admin/transactions/${accountNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerTransactions(
        response.data.transactions || []
      );

      setShowTransactions(true);
    } catch (error) {
      console.error(
        "Customer Transaction Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load customer transactions"
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();
  };

  // ========================================
  // FORMAT MONEY
  // ========================================

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ========================================
  // TRANSACTION TYPE
  // ========================================

  const getTransactionType = (transaction) => {
    return (
      transaction.type ||
      transaction.transactionType ||
      "Transaction"
    );
  };

  // ========================================
  // TRANSACTION DIRECTION
  // ========================================

  const getTransactionDirection = (
    transaction,
    customer
  ) => {
    if (!customer) {
      return "";
    }

    const senderId =
      transaction.sender?._id ||
      transaction.sender;

    const receiverId =
      transaction.receiver?._id ||
      transaction.receiver;

    if (senderId === customer._id) {
      return "Sent";
    }

    if (receiverId === customer._id) {
      return "Received";
    }

    return "";
  };

  // ========================================
  // TRANSACTION AMOUNT CLASS
  // ========================================

  const getAmountClass = (
    transaction,
    customer
  ) => {
    const direction = getTransactionDirection(
      transaction,
      customer
    );

    if (direction === "Received") {
      return "transaction-received";
    }

    if (direction === "Sent") {
      return "transaction-sent";
    }

    return "";
  };

  // ========================================
  // CLOSE CUSTOMER DETAILS
  // ========================================

  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
  };

  // ========================================
  // CLOSE TRANSACTIONS
  // ========================================

  const closeTransactions = () => {
    setShowTransactions(false);
    setCustomerTransactions([]);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="admin-customer">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="customer-header">

        <div>
          <h2>👥 Customer Management</h2>

          <p>
            View and manage SmartBank customers.
          </p>
        </div>

        <button
          className="customer-load-btn"
          onClick={loadCustomers}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "🔄 Load Customers"}
        </button>

      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="customer-error">
          {error}
        </div>
      )}

      {/* ========================================
          EMPTY STATE
      ======================================== */}

      {!loaded && !loading && (
        <div className="customer-empty">
          <p>
            Click "Load Customers" to view
            customer accounts.
          </p>
        </div>
      )}

      {/* ========================================
          LOADING
      ======================================== */}

      {loading && (
        <div className="customer-loading">
          Loading customers...
        </div>
      )}

      {/* ========================================
          CUSTOMER TABLE
      ======================================== */}

      {!loading && customers.length > 0 && (
        <div className="customer-table-wrapper">

          <table className="customer-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Account</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {customers.map((customer) => (
                <tr key={customer._id}>

                  {/* NAME */}
                  <td>
                    <strong>
                      {customer.name}
                    </strong>
                  </td>

                  {/* EMAIL */}
                  <td>
                    {customer.email}
                  </td>

                  {/* ACCOUNT */}
                  <td>
                    {customer.accountNumber}
                  </td>

                  {/* BALANCE */}
                  <td>
                    $
                    {formatMoney(
                      customer.balance
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={
                        customer.isFrozen
                          ? "customer-status frozen"
                          : "customer-status active"
                      }
                    >
                      {customer.isFrozen
                        ? "Frozen"
                        : "Active"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>

                    <div className="customer-actions">

                      {/* VIEW */}
                      <button
                        className="view-customer-btn"
                        onClick={() =>
                          setSelectedCustomer(
                            customer
                          )
                        }
                      >
                        👁 View
                      </button>

                      {/* FREEZE / UNFREEZE */}
                      {customer.isFrozen ? (
                        <button
                          className="unfreeze-btn"
                          onClick={() =>
                            handleUnfreeze(
                              customer.accountNumber
                            )
                          }
                        >
                          🔓 Unfreeze
                        </button>
                      ) : (
                        <button
                          className="freeze-btn"
                          onClick={() =>
                            handleFreeze(
                              customer.accountNumber
                            )
                          }
                        >
                          🔒 Freeze
                        </button>
                      )}

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

      {/* ========================================
          NO CUSTOMERS
      ======================================== */}

      {loaded &&
        !loading &&
        customers.length === 0 && (
          <div className="customer-empty">
            <p>No customers found.</p>
          </div>
        )}

      {/* ========================================
          CUSTOMER DETAILS MODAL
      ======================================== */}

      {selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onClick={closeCustomerDetails}
        >

          <div
            className="customer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="customer-modal-header">

              <div>
                <h2>
                  Customer Details
                </h2>

                <p>
                  Complete customer account
                  information
                </p>
              </div>

              <button
                className="customer-modal-close"
                onClick={closeCustomerDetails}
              >
                ✕
              </button>

            </div>

            {/* CUSTOMER DETAILS */}

            <div className="customer-details">

              <div className="customer-detail-item">
                <span>
                  👤 Full Name
                </span>

                <strong>
                  {selectedCustomer.name}
                </strong>
              </div>

              <div className="customer-detail-item">
                <span>
                  📧 Email
                </span>

                <strong>
                  {selectedCustomer.email}
                </strong>
              </div>

              <div className="customer-detail-item">
                <span>
                  🏦 Account Number
                </span>

                <strong>
                  {selectedCustomer.accountNumber}
                </strong>
              </div>

              <div className="customer-detail-item">
                <span>
                  💰 Balance
                </span>

                <strong>
                  $
                  {formatMoney(
                    selectedCustomer.balance
                  )}
                </strong>
              </div>

              <div className="customer-detail-item">
                <span>
                  🔵 Account Status
                </span>

                <strong
                  className={
                    selectedCustomer.isFrozen
                      ? "detail-frozen"
                      : "detail-active"
                  }
                >
                  {selectedCustomer.isFrozen
                    ? "Frozen"
                    : "Active"}
                </strong>
              </div>

              <div className="customer-detail-item">
                <span>
                  👤 Role
                </span>

                <strong>
                  {selectedCustomer.role ||
                    "customer"}
                </strong>
              </div>

              <div className="customer-detail-item">
                <span>
                  📅 Created At
                </span>

                <strong>
                  {formatDate(
                    selectedCustomer.createdAt
                  )}
                </strong>
              </div>

            </div>

            {/* TRANSACTION BUTTON */}

            <div className="customer-transaction-action">

              <button
                className="view-transactions-btn"
                onClick={() =>
                  loadCustomerTransactions(
                    selectedCustomer.accountNumber
                  )
                }
                disabled={transactionLoading}
              >
                {transactionLoading
                  ? "Loading..."
                  : "💳 View Transactions"}
              </button>

            </div>

            {/* MODAL FOOTER */}

            <div className="customer-modal-footer">

              <button
                onClick={closeCustomerDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================
          TRANSACTION HISTORY MODAL
      ======================================== */}

      {showTransactions && (
        <div
          className="customer-modal-overlay"
          onClick={closeTransactions}
        >

          <div
            className="customer-modal transaction-history-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* TRANSACTION HEADER */}

            <div className="customer-modal-header">

              <div>
                <h2>
                  💳 Transaction History
                </h2>

                <p>
                  {selectedCustomer?.name}
                  {" — "}
                  {selectedCustomer?.accountNumber}
                </p>
              </div>

              <button
                className="customer-modal-close"
                onClick={closeTransactions}
              >
                ✕
              </button>

            </div>

            {/* TRANSACTIONS */}

            <div className="customer-transaction-list">

              {customerTransactions.length ===
              0 ? (
                <div className="customer-empty">
                  <p>
                    No transactions found.
                  </p>
                </div>
              ) : (
                customerTransactions.map(
                  (transaction) => {

                    const direction =
                      getTransactionDirection(
                        transaction,
                        selectedCustomer
                      );

                    return (
                      <div
                        className="customer-transaction-item"
                        key={transaction._id}
                      >

                        {/* LEFT */}

                        <div className="transaction-info">

                          <strong>
                            {getTransactionType(
                              transaction
                            )}
                          </strong>

                          <small>
                            {formatDate(
                              transaction.createdAt
                            )}
                          </small>

                          {direction && (
                            <span>
                              {direction}
                            </span>
                          )}

                        </div>

                        {/* AMOUNT */}

                        <div
                          className={`transaction-history-amount ${getAmountClass(
                            transaction,
                            selectedCustomer
                          )}`}
                        >
                          {direction ===
                          "Received"
                            ? "+"
                            : direction === "Sent"
                            ? "-"
                            : ""}

                          $
                          {formatMoney(
                            transaction.amount
                          )}
                        </div>

                        {/* STATUS */}

                        <span
                          className={`transaction-history-status ${
                            transaction.status ||
                            "unknown"
                          }`}
                        >
                          {transaction.status ||
                            "Unknown"}
                        </span>

                      </div>
                    );
                  }
                )
              )}

            </div>

            {/* FOOTER */}

            <div className="customer-modal-footer">

              <button
                onClick={closeTransactions}
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

export default AdminCustomer;