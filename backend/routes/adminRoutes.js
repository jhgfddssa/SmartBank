const express = require("express");

const {
    freezeAccount,
    unfreezeAccount
} = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.put(
    "/freeze/:accountNumber",
    protect,
    authorize("admin"),
    freezeAccount
);

router.put(
    "/unfreeze/:accountNumber",
    protect,
    authorize("admin"),
    unfreezeAccount
);

module.exports = router;