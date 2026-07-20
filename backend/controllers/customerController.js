const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// ── CUSTOMER AUTHENTICATION ──

// @desc    Register a new customer
// @route   POST /api/customer/register
exports.registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone,
      role: "customer",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login customer
// @route   POST /api/customer/login
exports.loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Customer account required.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current customer profile
// @route   GET /api/customer/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set a new password",
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
      user.password = newPassword; // Trigger mongoose pre-save hashing
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── ADDRESS MANAGEMENT ──

// @desc    Get shipping addresses
// @route   GET /api/customer/addresses
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add shipping address
// @route   POST /api/customer/addresses
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { type, isDefault, fullName, addressLine, city, state, pinCode, phone } = req.body;

    if (!fullName || !addressLine || !city || !state || !pinCode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required address fields",
      });
    }

    const newAddress = {
      type: type || "Home",
      isDefault: isDefault || false,
      fullName,
      addressLine,
      city,
      state,
      pinCode,
      phone,
    };

    // If isDefault is true or this is the first address, set all other addresses to false
    if (newAddress.isDefault || user.addresses.length === 0) {
      newAddress.isDefault = true;
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipping address
// @route   PUT /api/customer/addresses/:addressId
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { addressId } = req.params;
    const { type, isDefault, fullName, addressLine, city, state, pinCode, phone } = req.body;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (type) address.type = type;
    if (fullName) address.fullName = fullName;
    if (addressLine) address.addressLine = addressLine;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pinCode) address.pinCode = pinCode;
    if (phone) address.phone = phone;

    if (isDefault !== undefined) {
      address.isDefault = isDefault;
      if (isDefault) {
        user.addresses.forEach((addr) => {
          if (addr._id.toString() !== addressId) {
            addr.isDefault = false;
          }
        });
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/customer/addresses/:addressId
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { addressId } = req.params;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);

    // If we deleted the default address, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};
