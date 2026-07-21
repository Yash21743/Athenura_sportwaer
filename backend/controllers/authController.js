const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

// ===============================
// GENERATE JWT TOKEN
// ===============================

const generateToken = (id) => {
  return jwt.sign(
    { id },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpire,
    }
  );
};

// ===============================
// ADMIN REGISTER
// ===============================

exports.setupAdmin = async (req, res, next) => {
  try {
    const {
      setupKey,
      name,
      email,
      password,
    } = req.body;

    // Validate fields
    if (!setupKey || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate setup key
    if (
      setupKey.trim() !==
      config.setupKey.trim()
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid setup key",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Check existing email
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // Create admin
    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "admin",
      isVerified: true,
    });

    // Generate token
    const token = generateToken(admin._id);

    return res.status(201).json({
      success: true,
      message:
        "Admin account created successfully",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// ADMIN LOGIN
// ===============================

exports.login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Find user
    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Admin only
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Admin account required.",
      });
    }

    // Compare password
    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();

    await user.save();

    // Token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET CURRENT USER
// ===============================

exports.getMe = async (req, res, next) => {
  try {
    const user =
      await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// UPDATE PROFILE
// ===============================

exports.updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Change password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is required",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      user.password = newPassword;
    }

    if (name) {
      user.name = name.trim();
    }

    if (email) {
      user.email =
        email.toLowerCase().trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};