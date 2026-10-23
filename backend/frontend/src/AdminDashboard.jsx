import AdminLoan from "./AdminLoan";
import AdminCustomer from "./AdminCustomer";
import AdminOverview from "./AdminOverview";
import AdminTransaction from "./AdminTransaction";
import AdminAuditLog from "./AdminAuditLog";
import "./AdminDashboard.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="admin-dashboard">

      
{/* HEADER */}
<header className="admin-header">
  <div className="admin-brand">
    <h1>🏦 SmartBank Admin</h1>
    <p>Welcome, {user?.name || "Admin"}</p>
  </div>

  <button
    type="button"
    className="admin-logout-button"
    onClick={handleLogout}
  >
    Logout <span aria-hidden="true">↗</span>
  </button>
</header>


      {/* LAYOUT */}
      <div className="admin-layout">

        {/* SIDEBAR */}
        <aside className="admin-sidebar">

          <div className="sidebar-logo">
            <h2>🏦 SmartBank</h2>
            <span>Admin Panel</span>
          </div>

          <nav className="sidebar-nav">

            <button
              onClick={() =>
                document
                  .getElementById("overview-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              📊 Overview
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("customers-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              👥 Customers
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("loans-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              💰 Loans
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("transactions-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              💳 Transactions
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("audit-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              🔐 Audit Logs
            </button>

          </nav>

        </aside>

        {/* MAIN CONTENT */}
        <main className="admin-content">

          <div className="admin-welcome">
            <h2>Admin Dashboard</h2>
            <p>
              Manage customers, loans, and banking operations.
            </p>
          </div>

          {/* OVERVIEW */}
          <section id="overview-section">
            <AdminOverview />
          </section>

          {/* CUSTOMERS */}
          <section id="customers-section">
            <AdminCustomer />
          </section>

          {/* LOANS */}
          <section id="loans-section">
            <AdminLoan />
          </section>

          {/* TRANSACTIONS */}
          <section id="transactions-section">
            <AdminTransaction />
          </section>

          {/* AUDIT LOGS */}
          <section id="audit-section">
            <AdminAuditLog />
          </section>

        </main>

      </div>

    </div>
  );
}

export default AdminDashboard;