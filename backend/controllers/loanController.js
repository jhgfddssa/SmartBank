const Loan = require("../models/Loan");

const applyLoan = async (req, res) => {
    try {

        const {
            amount,
            purpose,
            duration
        } = req.body;

        if (!amount || !purpose || !duration) {
            return res.status(400).json({
                message: "All loan fields are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Invalid loan amount"
            });
        }

        const loan = await Loan.create({
            user: req.user._id,
            amount,
            purpose,
            duration
        });

        res.status(201).json({
            message: "Loan application submitted",
            loan
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getMyLoans = async (req, res) => {
    try {

        const loans = await Loan.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.json(loans);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    applyLoan,
    getMyLoans
};