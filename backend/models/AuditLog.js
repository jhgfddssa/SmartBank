const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            required: true,
            enum: [
                "FREEZE_ACCOUNT",
                "UNFREEZE_ACCOUNT",
                "APPROVE_LOAN",
                "REJECT_LOAN"
            ]
        },

        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        targetLoan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Loan",
            default: null
        },

        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);