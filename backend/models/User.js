const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        accountNumber: {
            type: String,
            required: true,
            unique: true
        },

        balance: {
            type: Number,
            default: 0
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        },

        isFrozen: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);