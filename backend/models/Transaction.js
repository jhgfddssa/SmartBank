const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        type: {
            type: String,
            enum: ["transfer", "payment"],
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["success", "failed", "blocked"],
            default: "success"
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);