const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateAccountNumber = () => {
    return Math.floor(
        10000000 + Math.random() * 90000000
    ).toString();
};

// REGISTER
const register = async (req, res) => {
    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            accountNumber: generateAccountNumber(),
            balance: 1000
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountNumber: user.accountNumber,
                balance: user.balance
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.isFrozen) {
            return res.status(403).json({
                message: "Account is frozen"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountNumber: user.accountNumber,
                balance: user.balance,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};