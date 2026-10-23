const Loan = require("../models/Loan");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// ============================================
// GET ALL LOANS
// Admin can view all loan applications
// ============================================
const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate(
                "user",
                "name email accountNumber balance"
            )
            .sort({ createdAt: -1 });

        res.json(loans);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ============================================
// APPROVE LOAN
// Admin can approve a pending loan
// ============================================
const approveLoan = async (req, res) => {
    try {
        const { loanId } = req.params;

        // Find loan
        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        // Only pending loans can be approved
        if (loan.status !== "pending") {
            return res.status(400).json({
                message: "This loan has already been processed"
            });
        }

        // Find customer
        const user = await User.findById(loan.user);

        if (!user) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // ============================================
        // Add loan amount to customer's balance
        // ============================================
        user.balance += Number(loan.amount);

        await user.save();

        // Change loan status
        loan.status = "approved";

        await loan.save();

        await AuditLog.create({
    admin: req.user._id,
    action: "APPROVE_LOAN",
    targetUser: user._id,
    targetLoan: loan._id,
    description: `Admin approved loan of $${loan.amount} for ${user.accountNumber}`
});

        res.json({
            message: "Loan approved successfully",
            loan,
            newBalance: user.balance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ============================================
// REJECT LOAN
// Admin can reject a pending loan
// ============================================
const rejectLoan = async (req, res) => {
    try {
        const { loanId } = req.params;

        // Find loan
        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        // Only pending loans can be rejected
        if (loan.status !== "pending") {
            return res.status(400).json({
                message: "This loan has already been processed"
            });
        }
        const user = await User.findById(loan.user);

            if (!user) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

        // Change loan status
        loan.status = "rejected";

        await loan.save();

        await AuditLog.create({
    admin: req.user._id,
    action: "REJECT_LOAN",
    targetUser: user._id,
    targetLoan: loan._id,
    description: `Admin rejected loan of $${loan.amount} for ${user.accountNumber}`
});

        res.json({
            message: "Loan rejected successfully",
            loan
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ============================================
// EXPORT CONTROLLERS
// ============================================
module.exports = {
    getAllLoans,
    approveLoan,
    rejectLoan
};