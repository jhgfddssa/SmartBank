const User = require("../models/User");
const Transaction = require("../models/Transaction");

// TRANSFER
const transfer = async (req, res) => {
    try {

        const {
            receiverAccount,
            amount
        } = req.body;

        if (!receiverAccount || !amount) {
            return res.status(400).json({
                message: "Receiver and amount are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        if (req.user.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const receiver = await User.findOne({
            accountNumber: receiverAccount
        });

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver account not found"
            });
        }

        if (receiver._id.equals(req.user._id)) {
            return res.status(400).json({
                message: "Cannot transfer to yourself"
            });
        }

        req.user.balance -= Number(amount);

        receiver.balance += Number(amount);

        await req.user.save();
        await receiver.save();

        const transaction = await Transaction.create({
            sender: req.user._id,
            receiver: receiver._id,
            type: "transfer",
            amount,
            status: "success",
            description: "Money transfer"
        });

        res.json({
            message: "Transfer successful",
            transaction,
            newBalance: req.user.balance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// PAYMENT
const payment = async (req, res) => {
    try {

        const {
            merchant,
            amount
        } = req.body;

        if (!merchant || !amount) {
            return res.status(400).json({
                message: "Merchant and amount are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Invalid amount"
            });
        }

        if (req.user.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        req.user.balance -= Number(amount);

        await req.user.save();

        const transaction = await Transaction.create({
            sender: req.user._id,
            type: "payment",
            amount,
            status: "success",
            description: `Payment to ${merchant}`
        });

        res.json({
            message: "Payment successful",
            transaction,
            newBalance: req.user.balance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// TRANSACTION HISTORY
const getTransactions = async (req, res) => {
    try {

        const transactions = await Transaction.find({
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]
        })
        .populate("sender", "name accountNumber")
        .populate("receiver", "name accountNumber")
        .sort({ createdAt: -1 });

        res.json(transactions);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    transfer,
    payment,
    getTransactions
};