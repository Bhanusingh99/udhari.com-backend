import validator from "validator";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { mailSender } from "../utils/mailSender.js";


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
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email is not correct"
            });
        }

        const token = uuidv4();
        console.log(token); // Corrected: Use 'token' instead of 'randomUuid'

        await User.findOneAndUpdate(
            { email },
            { token: token },
            { new: true }
        );

        mailSender(email,`http://localhost:3000/forgot-password/${token}`);

        return res.status(200).json({
            message: "URL is sent to your email",
            success: true,
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong, please try again later",
            success: false
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { email, newpassword, oldpassword, token } = req.body;
        
        if (!email || !newpassword || !oldpassword || !token) {
            return res.status(400).json({
                success: false,
                message: "Input fields should not be empty"
            });
        }

        if (newpassword !== oldpassword) {
            return res.status(400).json({
                success: false,
                message: "Both passwords should be the same"
            });
        }

        const user = await User.findOne({ email });

        if (!user || user.token !== token) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or token"
            });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


//reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, oldpassword, newpassword, confirmpassword } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Your email format is not correct"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found for the provided email"
            });
        }

        if (!await bcrypt.compare(oldpassword, user.password)) {
            return res.status(400).json({
                success: false,
                message: "Your old password is incorrect"
            });
        }

        if (newpassword !== confirmpassword) {
            return res.status(400).json({
                success: false,
                message: "Your confirm password is not the same as the new password"
            });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const updatePass = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatePass) {
            return res.status(500).json({
                success: false,
                message: "Error updating password"
            });
        }

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
