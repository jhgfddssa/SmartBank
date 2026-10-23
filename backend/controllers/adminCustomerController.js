const User = require("../models/User");

// ============================================
// GET ALL CUSTOMERS
// ============================================
const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find(
            { role: "customer" },
            "-password"
        ).sort({ createdAt: -1 });

        res.json(customers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllCustomers
};