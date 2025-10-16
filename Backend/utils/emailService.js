const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: {
            name: 'Fresh Fruits Store',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset OTP - Fresh Fruits Store',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #e74c3c; margin: 0;">🍎 Fresh Fruits Store</h1>
                </div>
                <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
                <p style="font-size: 16px; line-height: 1.6;">You have requested to reset your password. Please use the following OTP to proceed:</p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px;">
                    <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                </div>
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> This OTP is valid for 5 minutes only.</p>
                </div>
                <p style="font-size: 16px; line-height: 1.6;">If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <div style="text-align: center; color: #666; font-size: 14px;">
                    <p>Best regards,<br><strong>Fresh Fruits Store Team</strong></p>
                    <p>🍊 Fresh • Healthy • Delicious 🥝</p>
                </div>
            </div>
        `
    };

    try {
        console.log('Sending OTP email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error.message);
        return { success: false, error: error.message };
    }
};

const sendLoginOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: {
            name: 'Fresh Fruits Store',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Login Verification OTP - Fresh Fruits Store',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #e74c3c; margin: 0;">🍎 Fresh Fruits Store</h1>
                </div>
                <h2 style="color: #333; text-align: center;">🔐 Secure Login Verification</h2>
                <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
                <p style="font-size: 16px; line-height: 1.6;">You are attempting to login with OTP verification. Please use the following OTP to complete your login:</p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px;">
                    <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                </div>
                <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #0c5460;"><strong>🔒 Security Note:</strong> This OTP is valid for 10 minutes only.</p>
                </div>
                <p style="font-size: 16px; line-height: 1.6;">If you didn't attempt to login, please secure your account immediately by changing your password.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <div style="text-align: center; color: #666; font-size: 14px;">
                    <p>Best regards,<br><strong>Fresh Fruits Store Team</strong></p>
                    <p>🍊 Fresh • Healthy • Secure 🥝</p>
                </div>
            </div>
        `
    };

    try {
        console.log('Sending Login OTP email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('Login OTP email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Login OTP email sending error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail, sendLoginOTPEmail };