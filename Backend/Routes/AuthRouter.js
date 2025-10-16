const { signup, login, loginOTP, verifyLoginOTP, forgotPassword, resetPassword } = require('../controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middleware/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/login-otp', loginValidation, loginOTP);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;