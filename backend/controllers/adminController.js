const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const freezeAccount = async (req, res) => {
    try {

        const { accountNumber } = req.params;

        const user = await User.findOne({
            accountNumber
        });

        if (!user) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        user.isFrozen = true;

        await user.save();

                await AuditLog.create({
            admin: req.user._id,
            action: "FREEZE_ACCOUNT",
            targetUser: user._id,
            description: `Admin froze account ${user.accountNumber}`
        });

        res.json({
            message: "Account has been frozen"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const unfreezeAccount = async (req, res) => {
    try {

        const { accountNumber } = req.params;

        const user = await User.findOne({
            accountNumber
        });

        if (!user) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        user.isFrozen = false;

        await user.save();

        await AuditLog.create({
    admin: req.user._id,
    action: "UNFREEZE_ACCOUNT",
    targetUser: user._id,
    description: `Admin unfroze account ${user.accountNumber}`
});

        res.json({
            message: "Account has been unfrozen"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    freezeAccount,
    unfreezeAccount
};