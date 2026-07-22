const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");
const { sendEmail } = require("../config/email");

// ===============================
// GENERATE JWT
// ===============================

const generateToken = (userId) => {
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    {
      id: userId.toString(),
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpire || "7d",
    }
  );
};

// ===============================
// GENERATE OTP
// ===============================

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ===============================
// OTP EXPIRY
// ===============================

const getOtpExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

// ===============================
// USER RESPONSE
// ===============================

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "user",
    isVerified: user.isVerified || false,
  };
};

// ===============================
// REGISTER - SEND OTP
// ===============================

exports.sendRegisterOtp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +otp +otpExpiry");

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    const otp = generateOtp();
    const otpExpiry = getOtpExpiry();

    // First create/update user
    if (user) {
      user.name = name;
      user.phone = phone || "";
      user.password = password;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      user = new User({
        name,
        email: normalizedEmail,
        phone: phone || "",
        password,
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    // Save user
    await user.save();

    // Send email
    await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your Comfy Sport Wear Account",

      htmlContent: `
        <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 30px;">
          <h2>Welcome to Comfy Sport Wear 👋</h2>
          <p>Hello ${name},</p>
          <p>Your verification OTP is:</p>

          <h1 style="color: #14a889; letter-spacing: 10px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,

      textContent: `Your Comfy Sport Wear verification OTP is ${otp}`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error("REGISTER OTP ERROR FULL:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send registration OTP",
    });
  }
};

// ===============================
// VERIFY REGISTER OTP
// ===============================

exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (
      user.otp !== otp.trim() ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

// ===============================
// LOGIN
// ===============================

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ===============================
// FORGOT PASSWORD OTP
// ===============================

exports.sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first",
      });
    }

    const otp = generateOtp();
    const otpExpiry = getOtpExpiry();

    await sendEmail({
      to: normalizedEmail,
      subject: "Reset Your Comfy Sport Wear Password",

      htmlContent: `
        <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 30px;">
          <h2>Password Reset Request 🔐</h2>

          <p>Your password reset OTP is:</p>

          <h1 style="color: #14a889; letter-spacing: 10px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,

      textContent: `Your password reset OTP is ${otp}`,
    });

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error("FORGOT OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send reset OTP",
    });
  }
};

// ===============================
// RESET PASSWORD
// ===============================

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !user.otp ||
      !user.otpExpiry ||
      user.otp !== otp.trim() ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
};

// ===============================
// GET CURRENT USER
// GET /api/users/me
// ===============================

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: getUserResponse(user),
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

// ===============================
// UPDATE USER PROFILE
// PUT /api/users/me
// ===============================
exports.updateMe = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email.trim().toLowerCase();
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: getUserResponse(user),
    });
  } catch (error) {
    console.error("UPDATE ME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

// ===============================
// CHANGE PASSWORD
// PUT /api/users/me/password
// ===============================
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
    });
  }
};

// ===============================
// GET ALL USERS (Admin)
// GET /api/admin/users
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(u => ({
        _id: u._id,
        id: u._id,
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role || "user",
        isVerified: u.isVerified || false,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ===============================
// DELETE USER (Admin)
// DELETE /api/admin/users/:id
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};