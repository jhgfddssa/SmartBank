const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@smartbank.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123456", 10);

        const admin = await User.create({
            name: "SmartBank Admin",
            email: "admin@smartbank.com",
            password: hashedPassword,
            accountNumber: "99999999",
            balance: 0,
            role: "admin",
            isFrozen: false
        });

        console.log("Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Account Number:", admin.accountNumber);
        console.log("Role:", admin.role);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();