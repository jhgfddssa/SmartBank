const express = require("express");

const {
    getAllTransactions,
    getCustomerTransactions
} = require("../controllers/adminTransactionController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET ALL TRANSACTIONS
// ========================================
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllTransactions
);

// ========================================
// GET CUSTOMER TRANSACTIONS
// ========================================
router.get(
    "/:accountNumber",
    protect,
    authorize("admin"),
    getCustomerTransactions
);

module.exports = router;