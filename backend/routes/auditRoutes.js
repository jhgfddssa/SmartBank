const express = require("express");

const {
    getAllAuditLogs
} = require("../controllers/auditController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllAuditLogs
);

module.exports = router;