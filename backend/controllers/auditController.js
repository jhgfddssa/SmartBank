const AuditLog = require("../models/AuditLog");

// GET ALL AUDIT LOGS
const getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate("admin", "name email accountNumber")
            .populate("targetUser", "name email accountNumber")
            .populate("targetLoan", "amount purpose status")
            .sort({ createdAt: -1 });

        res.json(logs);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllAuditLogs
};