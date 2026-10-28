import { useState } from "react";
import axios from "axios";
import "./AdminTransaction.css";
const API_URL = import.meta.env.VITE_API_URL;

function AdminTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/admin/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTransactions(response.data);
            setLoaded(true);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Failed to load transactions"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString();
    };

    const getTransactionType = (transaction) => {
        return (
            transaction.type ||
            transaction.transactionType ||
            "Transaction"
        );
    };

    const getStatus = (transaction) => {
        return transaction.status || "Completed";
    };

    const filteredTransactions = transactions.filter(
        (transaction) => {
            const senderName =
                transaction.sender?.name?.toLowerCase() || "";

            const senderAccount =
                transaction.sender?.accountNumber?.toLowerCase() ||
                "";

            const receiverName =
                transaction.receiver?.name?.toLowerCase() || "";

            const receiverAccount =
                transaction.receiver?.accountNumber?.toLowerCase() ||
                "";

            const searchText = search.toLowerCase();

            const matchesSearch =
                senderName.includes(searchText) ||
                senderAccount.includes(searchText) ||
                receiverName.includes(searchText) ||
                receiverAccount.includes(searchText);

            const transactionType =
                getTransactionType(transaction).toLowerCase();

            const transactionStatus =
                getStatus(transaction).toLowerCase();

            const matchesType =
                typeFilter === "all" ||
                transactionType === typeFilter.toLowerCase();

            const matchesStatus =
                statusFilter === "all" ||
                transactionStatus === statusFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );
        }
    );

    const totalAmount = filteredTransactions.reduce(
        (total, transaction) => {
            return total + Number(transaction.amount || 0);
        },
        0
    );

    return (
        <>
            <section className="admin-transactions">

                {/* Header */}
                <div className="admin-section-header">
                    <div>
                        <h2>Transaction Monitoring</h2>

                        <p>
                            Monitor and search all customer
                            transactions
                        </p>
                    </div>

                    <div>
                        {!loaded ? (
                            <button
                                onClick={loadTransactions}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading..."
                                    : "Load Transactions"}
                            </button>
                        ) : (
                            <button
                                onClick={loadTransactions}
                                disabled={loading}
                            >
                                {loading
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && !loaded && (
                    <div className="admin-loading">
                        Loading transactions...
                    </div>
                )}

                {loaded && (
                    <>
                        {/* Statistics */}
                        <div className="transaction-stats">

                            <div className="transaction-stat-card">
                                <h3>Total Transactions</h3>

                                <strong>
                                    {filteredTransactions.length}
                                </strong>
                            </div>

                            <div className="transaction-stat-card">
                                <h3>Total Amount</h3>

                                <strong>
                                    $
                                    {totalAmount.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>
                            </div>

                        </div>

                        {/* Search & Filters */}
                        <div className="transaction-filters">

                            <div className="filter-group">
                                <label>
                                    Search Customer
                                </label>

                                <input
                                    type="text"
                                    placeholder="Name or account number..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="filter-group">
                                <label>
                                    Transaction Type
                                </label>

                                <select
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="all">
                                        All Types
                                    </option>

                                    <option value="transfer">
                                        Transfer
                                    </option>

                                    <option value="payment">
                                        Payment
                                    </option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>
                                    Status
                                </label>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="all">
                                        All Status
                                    </option>

                                    <option value="success">
                                        Success
                                    </option>

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="failed">
                                        Failed
                                    </option>
                                </select>
                            </div>

                            <div className="filter-group clear-filter">
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setTypeFilter("all");
                                        setStatusFilter("all");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>

                        </div>

                        {/* Empty */}
                        {filteredTransactions.length === 0 && (
                            <div className="admin-empty">
                                No transactions match your
                                search or filters.
                            </div>
                        )}

                        {/* Table */}
                        {filteredTransactions.length > 0 && (
                            <div className="transaction-table-wrapper">

                                <table className="transaction-table">

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Sender</th>
                                            <th>Receiver</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredTransactions.map(
                                            (
                                                transaction,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        transaction._id ||
                                                        index
                                                    }
                                                    onClick={() =>
                                                        setSelectedTransaction(
                                                            transaction
                                                        )
                                                    }
                                                    style={{
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {transaction
                                                                .sender
                                                                ?.name ||
                                                                "N/A"}
                                                        </strong>

                                                        <br />

                                                        <small>
                                                            {transaction
                                                                .sender
                                                                ?.accountNumber ||
                                                                "N/A"}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {transaction
                                                                .receiver
                                                                ?.name ||
                                                                "N/A"}
                                                        </strong>

                                                        <br />

                                                        <small>
                                                            {transaction
                                                                .receiver
                                                                ?.accountNumber ||
                                                                "N/A"}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {getTransactionType(
                                                            transaction
                                                        )}
                                                    </td>

                                                    <td>
                                                        $
                                                        {Number(
                                                            transaction.amount ||
                                                                0
                                                        ).toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span className="transaction-status">
                                                            {getStatus(
                                                                transaction
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            transaction.createdAt
                                                        )}
                                                    </td>

                                                </tr>
                                            )
                                        )}
                                    </tbody>

                                </table>

                            </div>
                        )}

                    </>
                )}

            </section>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div
                    className="transaction-modal-overlay"
                    onClick={() =>
                        setSelectedTransaction(null)
                    }
                >
                    <div
                        className="transaction-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="transaction-modal-header">

                            <div>
                                <h2>
                                    Transaction Details
                                </h2>

                                <p>
                                    Complete transaction
                                    information
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedTransaction(
                                        null
                                    )
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <div className="transaction-details">

                            <div className="detail-item">
                                <span>
                                    Transaction ID
                                </span>

                                <strong>
                                    {selectedTransaction._id ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Sender
                                </span>

                                <strong>
                                    {selectedTransaction
                                        .sender?.name ||
                                        "N/A"}
                                </strong>

                                <small>
                                    Account:{" "}
                                    {selectedTransaction
                                        .sender
                                        ?.accountNumber ||
                                        "N/A"}
                                </small>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Receiver
                                </span>

                                <strong>
                                    {selectedTransaction
                                        .receiver?.name ||
                                        "N/A"}
                                </strong>

                                <small>
                                    Account:{" "}
                                    {selectedTransaction
                                        .receiver
                                        ?.accountNumber ||
                                        "N/A"}
                                </small>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Amount
                                </span>

                                <strong>
                                    $
                                    {Number(
                                        selectedTransaction.amount ||
                                            0
                                    ).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Transaction Type
                                </span>

                                <strong>
                                    {getTransactionType(
                                        selectedTransaction
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {getStatus(
                                        selectedTransaction
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Date
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedTransaction.createdAt
                                    )}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>
                                    Description
                                </span>

                                <strong>
                                    {selectedTransaction
                                        .description ||
                                        selectedTransaction
                                            .details ||
                                        "No description"}
                                </strong>
                            </div>

                        </div>

                        <div className="transaction-modal-footer">

                            <button
                                onClick={() =>
                                    setSelectedTransaction(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </>
    );
}

export default AdminTransaction;