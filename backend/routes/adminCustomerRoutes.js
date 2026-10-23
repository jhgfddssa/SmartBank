const express = require("express");

const {
    getAllCustomers
} = require("../controllers/adminCustomerController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL CUSTOMERS
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllCustomers
);

module.exports = router;