import validator from "validator";
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from "../models/user.model.js";

// sign-up
export const signUp = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({
                message: "Input field can't be empty",
                success: false
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "email format is not correct",
                success: false
            })
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message: "password must contain at least one char, one special char, and one letter",
                success: false
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "user already exists with this email",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = await User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword
        })

        const payload = {
            id: createUser._id,
            email: createUser.email
        }

        const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: "5h" });

        res.cookie('token', token, {
            maxAge: 5 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(200).json({
            message: 'user successfully created',
            success: true,
            token,
        });
    } catch (error) {
        console.log(error)
        throw error
    }
}

//log-in
export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please check your email and try again.",
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password. Please try again.",
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn: "5h" });

        res.cookie('token', token, {
            maxAge: 5 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'User successfully logged in.',
            token,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
};


//forgot password
export const forgotPassword = async () => {
    
}