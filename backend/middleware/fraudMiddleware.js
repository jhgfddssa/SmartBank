const fraudDetection = (req, res, next) => {

    const { amount } = req.body;

    // Example rule:
    // Transaction above $10,000 is considered suspicious

    if (amount > 10000) {
        return res.status(403).json({
            success: false,
            fraud: true,
            message: "Transaction blocked: suspicious activity detected"
        });
    }

    next();
};

module.exports = fraudDetection;