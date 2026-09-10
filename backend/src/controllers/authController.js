const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ===============================
// GENERATE JWT TOKEN
// ===============================
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};


// ===============================
// REGISTER
// ===============================
const register = async (req, res) => {
    try {

        const {
            name,
            location,
            gender,
            email,
            phone,
            password
        } = req.body;


        // Check required fields
        if (
            !name ||
            !location ||
            !gender ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, location, gender, email, phone and password"
            });
        }


        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({
            name,
            location,
            gender,
            email,
            phone,
            password: hashedPassword
        });


        // Generate JWT
        const token = generateToken(user);


        // Send response
        res.status(201).json({
            success: true,
            message: "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                location: user.location,
                gender: user.gender,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Register error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// LOGIN
// ===============================
const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }


        // Find user
        const user = await User.findOne({ email });


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        // Generate token
        const token = generateToken(user);


        // Send response
        res.json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                location: user.location,
                gender: user.gender,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// GET CURRENT USER
// ===============================
const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                location: req.user.location,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role,
                createdAt: req.user.createdAt
            }
        });

    } catch (error) {
        console.error("Get user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    register,
    login,
    getMe
};