const express = require('express');
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);

module.exports = router;