const express = require("express");

const {
    applyLoan,
    getMyLoans
} = require("../controllers/loanController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/apply",
    protect,
    applyLoan
);

router.get(
    "/my-loans",
    protect,
    getMyLoans
);

module.exports = router;