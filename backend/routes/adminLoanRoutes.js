const express = require("express");

const {
    getAllLoans,
    approveLoan,
    rejectLoan
} = require("../controllers/adminLoanController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================
// GET ALL LOANS
// Admin only
// ============================================
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllLoans
);


// ============================================
// APPROVE LOAN
// Admin only
// ============================================
router.put(
    "/:loanId/approve",
    protect,
    authorize("admin"),
    approveLoan
);


// ============================================
// REJECT LOAN
// Admin only
// ============================================
router.put(
    "/:loanId/reject",
    protect,
    authorize("admin"),
    rejectLoan
);


module.exports = router;