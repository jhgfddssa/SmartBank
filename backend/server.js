const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const adminLoanRoutes = require("./routes/adminLoanRoutes");
const adminCustomerRoutes = require("./routes/adminCustomerRoutes");
const adminTransactionRoutes = require("./routes/adminTransactionRoutes");
const auditRoutes = require("./routes/auditRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());


// Routes
app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/transactions",
    require("./routes/transactionRoutes")
);

app.use(
    "/api/loans",
    require("./routes/loanRoutes")
);

app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);

app.use("/api/admin/loans", adminLoanRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use(
    "/api/admin/transactions",
    adminTransactionRoutes
);
app.use("/api/admin/audit-logs", auditRoutes);

// Test
app.get("/", (req, res) => {
    res.json({
        message: "SmartBank API is running"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});