const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes - user must be logged in
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorResponse('User no longer exists', 401));
    }

    // Check if user changed password after token was issued
    if (req.user.changedPasswordAfter(decoded.iat)) {
      return next(
        new ErrorResponse('User recently changed password. Please log in again', 401)
      );
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user is verified
exports.verified = async (req, res, next) => {
  if (!req.user.isAccountVerified) {
    return next(
      new ErrorResponse('Please verify your account to access this route', 403)
    );
  }
  next();
};