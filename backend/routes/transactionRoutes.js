const express = require("express");

const {
    transfer,
    payment,
    getTransactions
} = require("../controllers/transactionController");

const {
    protect
} = require("../middleware/authMiddleware");

const fraudDetection = require("../middleware/fraudMiddleware");

const router = express.Router();

router.post(
    "/transfer",
    protect,
    fraudDetection,
    transfer
);

router.post(
    "/payment",
    protect,
    fraudDetection,
    payment
);

router.get(
    "/history",
    protect,
    getTransactions
);

module.exports = router;