const express = require("express");

const {
  sendRegisterOtp,
  verifyRegisterOtp,
  loginUser,
  sendForgotOtp,
  resetPassword,
} = require("../controllers/userAuthController");

const router = express.Router();

router.post(
  "/register/otp",
  sendRegisterOtp
);

router.post(
  "/register/verify",
  verifyRegisterOtp
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/forgot-password/otp",
  sendForgotOtp
);

router.post(
  "/forgot-password/reset",
  resetPassword
);

module.exports = router;