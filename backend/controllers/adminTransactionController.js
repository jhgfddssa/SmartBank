const Transaction = require("../models/Transaction");
const User = require("../models/User");

// ========================================
// GET ALL TRANSACTIONS
// ========================================
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("sender", "name email accountNumber")
            .populate("receiver", "name email accountNumber")
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ========================================
// GET CUSTOMER TRANSACTIONS
// ========================================
const getCustomerTransactions = async (req, res) => {
    try {
        const { accountNumber } = req.params;

        // Find customer by account number
        const customer = await User.findOne({
            accountNumber,
            role: "customer"
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Find transactions where customer is
        // either sender or receiver
        const transactions = await Transaction.find({
            $or: [
                { sender: customer._id },
                { receiver: customer._id }
            ]
        })
            .populate("sender", "name email accountNumber")
            .populate("receiver", "name email accountNumber")
            .sort({ createdAt: -1 });

        res.json({
            customer: {
                name: customer.name,
                email: customer.email,
                accountNumber: customer.accountNumber,
                balance: customer.balance
            },
            transactions
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllTransactions,
    getCustomerTransactions
};