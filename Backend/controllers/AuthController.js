const UserModel = require("../Model/User");
const OTPModel = require("../Model/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTPEmail, sendLoginOTPEmail } = require('../utils/emailService');

const signup = async(req,res) => {
    try{
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if(user){
            return res.status(409).json({message: "User already exists", success: false});
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({
            message: "Signup successfully",
            success: true
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const login = async(req,res) => {
    try{
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if(!user){
            return res.status(404).json({
                message: 'This email is not registered in our database. Please signup first.',
                success: false
            });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(403).json({
                message: 'Invalid password. Please check your password.',
                success: false
            });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        res.status(200).json({
            message: "Login success!",
            success: true,
            jwtToken,
            email,
            name: user.name
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'Email not found in our database',
                success: false
            });
        }
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        await OTPModel.findOneAndDelete({ email }); // Remove existing OTP
        const otpDoc = new OTPModel({ email, otp });
        await otpDoc.save();
        
        // Send OTP via email
        const emailResult = await sendOTPEmail(email, otp);
        
        if (emailResult.success) {
            res.status(200).json({
                message: 'OTP sent to your email successfully',
                success: true
            });
        } else {
            res.status(500).json({
                message: 'Failed to send OTP email',
                success: false
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        // Verify OTP
        const otpDoc = await OTPModel.findOne({ email, otp });
        if (!otpDoc) {
            return res.status(400).json({
                message: 'Invalid or expired OTP',
                success: false
            });
        }
        
        // Update user password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );
        
        // Delete used OTP
        await OTPModel.findOneAndDelete({ email, otp });
        
        res.status(200).json({
            message: 'Password reset successfully',
            success: true
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

const loginOTP = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verify user credentials first
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'This email is not registered in our database',
                success: false
            });
        }
        
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: 'Invalid password',
                success: false
            });
        }
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        await OTPModel.findOneAndDelete({ email }); // Remove existing OTP
        const otpDoc = new OTPModel({ email, otp });
        await otpDoc.save();
        
        // Generate session token for OTP verification
        const sessionToken = jwt.sign(
            { email: user.email, _id: user._id, type: 'otp-session' },
            process.env.JWT_SECRET,
            { expiresIn: '10m' } // Short expiry for OTP session
        );
        
        // Send OTP via email
        const emailResult = await sendLoginOTPEmail(email, otp);
        
        if (emailResult.success) {
            res.status(200).json({
                message: 'OTP sent to your email successfully',
                success: true,
                sessionToken
            });
        } else {
            res.status(500).json({
                message: 'Failed to send OTP email',
                success: false
            });
        }
    } catch (error) {
        console.error('Login OTP error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

const verifyLoginOTP = async (req, res) => {
    try {
        const { sessionToken, otp, email } = req.body;
        
        // Verify session token
        let decoded;
        try {
            decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
            if (decoded.type !== 'otp-session' || decoded.email !== email) {
                return res.status(401).json({
                    message: 'Invalid session',
                    success: false
                });
            }
        } catch (tokenError) {
            return res.status(401).json({
                message: 'Session expired',
                success: false
            });
        }
        
        // Verify OTP
        const otpDoc = await OTPModel.findOne({ email, otp });
        if (!otpDoc) {
            return res.status(400).json({
                message: 'Invalid or expired OTP',
                success: false
            });
        }
        
        // Get user details
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        
        // Generate final JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Delete used OTP
        await OTPModel.findOneAndDelete({ email, otp });
        
        res.status(200).json({
            message: 'Login successful!',
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (error) {
        console.error('Verify login OTP error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    loginOTP,
    verifyLoginOTP,
    forgotPassword,
    resetPassword
}