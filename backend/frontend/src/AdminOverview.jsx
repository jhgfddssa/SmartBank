import { useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./AdminOverview.css";
const API_URL = import.meta.env.VITE_API_URL;

function AdminOverview() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [customerResponse, loanResponse] =
        await Promise.all([
          axios.get(
  `${API_URL}/api/admin/customers`,
  { headers }
          ),
          axios.get(
  `${API_URL}/api/admin/loans`,
  { headers }
),
        ]);

      setCustomers(customerResponse.data);
      setLoans(loanResponse.data);

      setLoaded(true);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to load dashboard"
        );
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Statistics
  // ===============================

  const totalCustomers = customers.length;

  const totalBalance = customers.reduce(
    (total, customer) =>
      total + Number(customer.balance || 0),
    0
  );

  const activeCustomers = customers.filter(
    (customer) => !customer.isFrozen
  ).length;

  const frozenCustomers = customers.filter(
    (customer) => customer.isFrozen
  ).length;

  const totalLoans = loans.length;

  const pendingLoans = loans.filter(
    (loan) => loan.status === "pending"
  ).length;

  const approvedLoans = loans.filter(
    (loan) => loan.status === "approved"
  ).length;

  const rejectedLoans = loans.filter(
    (loan) => loan.status === "rejected"
  ).length;

  // ===============================
  // Chart Data
  // ===============================

  const loanChartData = [
    {
      name: "Pending",
      value: pendingLoans,
    },
    {
      name: "Approved",
      value: approvedLoans,
    },
    {
      name: "Rejected",
      value: rejectedLoans,
    },
  ];

  const customerChartData = [
    {
      name: "Active",
      value: activeCustomers,
    },
    {
      name: "Frozen",
      value: frozenCustomers,
    },
  ];

  const LOAN_COLORS = [
    "#f59e0b",
    "#22c55e",
    "#ef4444",
  ];

  const CUSTOMER_COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (
    <section className="admin-overview">

      {/* HEADER */}
      <div className="overview-header">
        <div>
          <h2>📊 Dashboard Overview</h2>
          <p>
            Monitor SmartBank activity
            and account statistics.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadOverview}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "🔄 Load Overview"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* FIRST LOAD */}
      {!loaded && !loading && (
        <div className="overview-load">
          <h3>
            📊 SmartBank Statistics
          </h3>

          <p>
            Click to load dashboard
          </p>

          <button
            className="load-button"
            onClick={loadOverview}
          >
            📥 Load Dashboard
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="loading-message">
          ⏳ Loading...
        </div>
      )}

      {/* CONTENT */}
      {loaded && !loading && (
        <>

          {/* MAIN CARDS */}
          <div className="overview-cards">

            <div className="overview-card">
              <div className="card-icon">
                👥
              </div>

              <div>
                <p>Total Customers</p>
                <h3>{totalCustomers}</h3>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                💰
              </div>

              <div>
                <p>Total Balance</p>

                <h3>
                  $
                  {totalBalance.toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                🟢
              </div>

              <div>
                <p>Active</p>
                <h3>{activeCustomers}</h3>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                🔒
              </div>

              <div>
                <p>Frozen</p>
                <h3>{frozenCustomers}</h3>
              </div>
            </div>

          </div>

          {/* LOAN OVERVIEW */}
          <div className="overview-section">

            <h3>🏦 Loan Overview</h3>

            <div className="loan-overview-cards">

              <div className="loan-overview-card">
                <span>📋</span>
                <div>
                  <p>Total</p>
                  <h3>{totalLoans}</h3>
                </div>
              </div>

              <div className="loan-overview-card">
                <span>⏳</span>
                <div>
                  <p>Pending</p>
                  <h3>{pendingLoans}</h3>
                </div>
              </div>

              <div className="loan-overview-card">
                <span>✅</span>
                <div>
                  <p>Approved</p>
                  <h3>{approvedLoans}</h3>
                </div>
              </div>

              <div className="loan-overview-card">
                <span>❌</span>
                <div>
                  <p>Rejected</p>
                  <h3>{rejectedLoans}</h3>
                </div>
              </div>

            </div>

          </div>

          {/* LOAN CHART */}
          <div className="overview-section">
            <h3>
              📈 Loan Status Distribution
            </h3>

            <div className="loan-chart-container">
              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <PieChart>

                  <Pie
                    data={loanChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {loanChartData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            LOAN_COLORS[index]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CUSTOMER CHART */}
          <div className="overview-section">

            <h3>
              👥 Customer Status
            </h3>

            <div className="loan-chart-container">

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <PieChart>

                  <Pie
                    data={customerChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {customerChartData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            CUSTOMER_COLORS[index]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>
          </div>

        </>
      )}
    </section>
  );
}

export default AdminOverview;