
import { useEffect, useState } from "react";
import axios from "axios";

import Transfer from "./Transfer";
import Payment from "./Payment";
import Loan from "./Loan";
import MyLoans from "./MyLoans";
import "./Dashboard.css";
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Account Statement filters
  const [statementStartDate, setStatementStartDate] = useState("");
  const [statementEndDate, setStatementEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showTransfer, setShowTransfer] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoan, setShowLoan] = useState(false);

  // Load transaction history
  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

            const response = await axios.get(
        `${API_URL}/api/transactions/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data.transactions || [];

        if (!cancelled) {
          setTransactions(list);
        }
      } catch (err) {
        console.error("Load transactions error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Cannot load transactions. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  // Format money
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Format date
  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString();
  };

  // Get date in local YYYY-MM-DD format
  const getLocalDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Identify the logged-in user
  const currentUserId = String(user?._id || user?.id || "");

  // Get an ID whether sender/receiver is populated or not
  const getAccountId = (account) => {
    if (!account) return "";
    if (typeof account === "object") {
      return String(account._id || account.id || "");
    }
    return String(account);
  };

  // Search and filter transaction history
  const filteredTransactions = transactions.filter((transaction) => {
    const keyword = searchTerm.trim().toLowerCase();

    const searchableText = [
      transaction.type,
      transaction.merchant,
      transaction.receiverAccount,
      transaction.senderAccount,
      transaction.status,
      transaction.description,
      transaction.reference,
      transaction.sender?.name,
      transaction.sender?.accountNumber,
      transaction.receiver?.name,
      transaction.receiver?.accountNumber,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(keyword);

    const transactionType = String(
      transaction.type || ""
    ).toLowerCase();

    const matchesType =
      typeFilter === "all" ||
      transactionType === typeFilter.toLowerCase();

    const transactionDate = getLocalDate(transaction.createdAt);

    const matchesDate =
      !dateFilter || transactionDate === dateFilter;

    return matchesSearch && matchesType && matchesDate;
  });

  // Account Statement: successful transactions in the chosen date range
  const statementTransactions = transactions.filter((transaction) => {
    if (String(transaction.status || "").toLowerCase() !== "success") {
      return false;
    }

    const transactionDate = getLocalDate(transaction.createdAt);

    if (!transactionDate) return false;

    if (
      statementStartDate &&
      transactionDate < statementStartDate
    ) {
      return false;
    }

    if (
      statementEndDate &&
      transactionDate > statementEndDate
    ) {
      return false;
    }

    return true;
  });

  // Calculate money received through incoming transfers
  const totalMoneyIn = statementTransactions.reduce(
    (total, transaction) => {
      const receiverId = getAccountId(transaction.receiver);

      const isIncomingTransfer =
        transaction.type === "transfer" &&
        currentUserId !== "" &&
        receiverId === currentUserId;

      return isIncomingTransfer
        ? total + Number(transaction.amount || 0)
        : total;
    },
    0
  );

  // Calculate outgoing transfers and payments
  const totalMoneyOut = statementTransactions.reduce(
    (total, transaction) => {
      const senderId = getAccountId(transaction.sender);

      const isOutgoing =
        currentUserId !== "" &&
        senderId === currentUserId &&
        ["transfer", "payment"].includes(transaction.type);

      return isOutgoing
        ? total + Number(transaction.amount || 0)
        : total;
    },
    0
  );

  const successfulTransactionCount = statementTransactions.length;

  // Download Account Statement as CSV
  const downloadStatementCSV = () => {
    if (statementStartDate && statementEndDate &&
        statementStartDate > statementEndDate) {
      setError("Start date cannot be later than end date.");
      return;
    }

    setError("");

    const escapeCSV = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = [
      [
        "Date",
        "Type",
        "Description",
        "Sender Account",
        "Receiver Account",
        "Amount",
        "Direction",
        "Status",
      ],
    ];

    statementTransactions.forEach((transaction) => {
      const senderId = getAccountId(transaction.sender);
      const receiverId = getAccountId(transaction.receiver);

      const isIncoming =
        transaction.type === "transfer" &&
        currentUserId !== "" &&
        receiverId === currentUserId;

      const isOutgoing =
        currentUserId !== "" &&
        senderId === currentUserId;

      let direction = "Other";

      if (isIncoming) {
        direction = "Money In";
      } else if (isOutgoing) {
        direction = "Money Out";
      }

      rows.push([
        formatDate(transaction.createdAt),
        transaction.type || "",
        transaction.description || "",
        transaction.sender?.accountNumber ||
          transaction.senderAccount ||
          "",
        transaction.receiver?.accountNumber ||
          transaction.receiverAccount ||
          "",
        Number(transaction.amount || 0).toFixed(2),
        direction,
        transaction.status || "",
      ]);
    });

    // Add UTF-8 BOM so Excel handles the CSV encoding properly
    const csvContent =
      "\uFEFF" +
      rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `SmartBank-Statement-${statementStartDate || "all"}-to-${statementEndDate || "all"}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Update balance after a successful transaction
  const updateUserBalance = (newBalance) => {
    if (newBalance === undefined || newBalance === null) return;

    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const updatedUser = {
        ...currentUser,
        balance: newBalance,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  // Add successful transaction to history
  const addTransaction = (transaction) => {
    if (!transaction) return;

    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions.filter(
        (item) => item._id !== transaction._id
      ),
    ]);
  };

  const handleTransferSuccess = (data) => {
    setShowTransfer(false);
    updateUserBalance(data?.newBalance);
    addTransaction(data?.transaction);
    setSuccess("Transfer completed successfully!");
    window.setTimeout(() => setSuccess(""), 5000);
  };

  const handlePaymentSuccess = (data) => {
    setShowPayment(false);
    updateUserBalance(data?.newBalance);
    addTransaction(data?.transaction);
    setSuccess("Payment completed successfully!");
    window.setTimeout(() => setSuccess(""), 5000);
  };

  if (!user) {
    return <h2>Loading user information...</h2>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      
{/* Header */}
<header className="dashboard-header">
  <div className="dashboard-brand">
    <h1>🏦 SmartBank</h1>
    <p>Welcome back, {user.name} 👋</p>
  </div>

  <button
    type="button"
    className="logout-button"
    onClick={handleLogout}
  >
    Logout <span aria-hidden="true">↗</span>
  </button>
</header>


      <main>
        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        {/* Account Balance */}
        <div className="balance-card">
          <p>Available Balance</p>
          <h2>${formatMoney(user.balance)}</h2>
          <p>Account Number: {user.accountNumber}</p>
        </div>

        {/* Banking Actions */}
        <div className="actions">
          <button
            type="button"
            onClick={() => setShowTransfer(true)}
          >
            💸 Transfer Money
          </button>

          <button
            type="button"
            onClick={() => setShowPayment(true)}
          >
            💳 Make Payment
          </button>

          <button
            type="button"
            onClick={() => setShowLoan(true)}
          >
            🏦 Apply for Loan
          </button>
        </div>

        {/* Account Statement */}
        <section className="account-statement">
          <div className="statement-heading">
            <div>
              <h2>📄 Account Statement</h2>
              <p>Review your successful transactions and export a report.</p>
            </div>
          </div>

          <div className="statement-filters">
            <div className="statement-date-field">
              <label htmlFor="statement-start-date">
                Start Date
              </label>
              <input
                id="statement-start-date"
                type="date"
                value={statementStartDate}
                max={statementEndDate || undefined}
                onChange={(event) =>
                  setStatementStartDate(event.target.value)
                }
              />
            </div>

            <div className="statement-date-field">
              <label htmlFor="statement-end-date">
                End Date
              </label>
              <input
                id="statement-end-date"
                type="date"
                value={statementEndDate}
                min={statementStartDate || undefined}
                onChange={(event) =>
                  setStatementEndDate(event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="statement-reset-button"
              onClick={() => {
                setStatementStartDate("");
                setStatementEndDate("");
                setError("");
              }}
            >
              Reset Dates
            </button>

            <button
              type="button"
              className="statement-download-button"
              onClick={downloadStatementCSV}
              disabled={loading || Boolean(error)}
            >
              ⬇ Download CSV
            </button>
          </div>

          <div className="statement-summary">
            <div className="statement-summary-card money-in">
              <span>Money In</span>
              <strong>${formatMoney(totalMoneyIn)}</strong>
            </div>

            <div className="statement-summary-card money-out">
              <span>Money Out</span>
              <strong>${formatMoney(totalMoneyOut)}</strong>
            </div>

            <div className="statement-summary-card transaction-total">
              <span>Successful Transactions</span>
              <strong>{successfulTransactionCount}</strong>
            </div>
          </div>

          <p className="statement-note">
            Only successful transactions are included. Money In counts
            incoming transfers; Money Out counts your transfers and payments.
          </p>

          {currentUserId === "" && (
            <p className="statement-warning">
              Your saved user information has no account ID. Please log out
              and log in again if Money In or Money Out shows zero incorrectly.
            </p>
          )}

          {!loading && statementTransactions.length === 0 && (
            <p className="statement-empty">
              No successful transactions found for this date range.
            </p>
          )}
        </section>

        {/* Transaction History */}
        <section className="transactions">
          <div className="transaction-heading">
            <div>
              <h2>Recent Transactions</h2>
              <p>Search and filter your transaction history.</p>
            </div>

            <span className="transaction-count">
              {filteredTransactions.length} found
            </span>
          </div>

          {/* Search and Filters */}
          <div className="transaction-filters">
            <input
              type="search"
              placeholder="🔎 Search transactions..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search transactions"
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by transaction type"
            >
              <option value="all">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter by date"
            />

            <button
              type="button"
              className="clear-filters-button"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
                setDateFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>

          {loading && (
            <p className="transaction-message">
              Loading transactions...
            </p>
          )}

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && transactions.length === 0 && (
            <p className="transaction-message">
              No transactions yet.
            </p>
          )}

          {!loading &&
            !error &&
            transactions.length > 0 &&
            filteredTransactions.length === 0 && (
              <div className="transaction-message">
                <p>No matching transactions found.</p>
                <button
                  type="button"
                  className="clear-filters-button"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setDateFilter("");
                  }}
                >
                  Reset Search
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            filteredTransactions.map((transaction) => (
              <button
                type="button"
                className="transaction-item"
                key={transaction._id}
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="transaction-main-info">
                  <strong>{transaction.type || "Transaction"}</strong>
                  <p>
                    {transaction.description ||
                      transaction.merchant ||
                      transaction.receiver?.accountNumber ||
                      "Bank transaction"}
                  </p>
                  <small>{formatDate(transaction.createdAt)}</small>
                </div>

                <div className="transaction-amount-info">
                  <strong>
                    ${formatMoney(transaction.amount)}
                  </strong>

                  <span
                    className={`transaction-status ${String(
                      transaction.status || "unknown"
                    ).toLowerCase()}`}
                  >
                    {transaction.status || "Unknown"}
                  </span>
                </div>
              </button>
            ))}
        </section>

        {/* My Loans */}
        <MyLoans />
      </main>

      {/* Transfer Modal */}
      {showTransfer && (
        <Transfer
          onClose={() => setShowTransfer(false)}
          onSuccess={handleTransferSuccess}
        />
      )}

      {/* Payment Modal */}
      {showPayment && (
        <Payment
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Loan Modal */}
      {showLoan && (
        <Loan
          onClose={() => setShowLoan(false)}
          onSuccess={() => {
            setShowLoan(false);
            setSuccess("Loan application submitted successfully!");
            window.setTimeout(() => setSuccess(""), 5000);
          }}
        />
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div
          className="transaction-details-overlay"
          onClick={() => setSelectedTransaction(null)}
        >
          <section
            className="transaction-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="transaction-details-header">
              <div>
                <h2 id="transaction-details-title">
                  Transaction Details
                </h2>
                <p>Review your transaction information.</p>
              </div>

              <button
                type="button"
                className="transaction-close-button"
                aria-label="Close transaction details"
                onClick={() => setSelectedTransaction(null)}
              >
                ✕
              </button>
            </div>

            <div className="transaction-details-body">
              <div className="transaction-detail-amount">
                <span>Transaction Amount</span>
                <strong>
                  ${formatMoney(selectedTransaction.amount)}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>Type</span>
                <strong>{selectedTransaction.type || "N/A"}</strong>
              </div>

              <div className="transaction-detail-row">
                <span>Status</span>
                <strong>{selectedTransaction.status || "Unknown"}</strong>
              </div>

              <div className="transaction-detail-row">
                <span>Description / Merchant</span>
                <strong>
                  {selectedTransaction.description ||
                    selectedTransaction.merchant ||
                    "N/A"}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>Sender Account</span>
                <strong>
                  {selectedTransaction.sender?.accountNumber ||
                    selectedTransaction.senderAccount ||
                    "N/A"}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>Receiver Account</span>
                <strong>
                  {selectedTransaction.receiver?.accountNumber ||
                    selectedTransaction.receiverAccount ||
                    "N/A"}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>Reference</span>
                <strong>
                  {selectedTransaction.reference ||
                    selectedTransaction._id ||
                    "N/A"}
                </strong>
              </div>

              <div className="transaction-detail-row">
                <span>Date</span>
                <strong>
                  {formatDate(selectedTransaction.createdAt)}
                </strong>
              </div>
            </div>

            <div className="transaction-details-footer">
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
