const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const admin = await User.findOne({
            email: "admin@smartbank.com"
        });

        if (!admin) {
            console.log("Admin not found");
            process.exit(1);
        }

        admin.isFrozen = false;
        admin.role = "admin";

        await admin.save();

        console.log("Admin account has been unfrozen!");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
        console.log("isFrozen:", admin.isFrozen);

        process.exit(0);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

resetAdmin();