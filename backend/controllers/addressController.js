const Address = require("../models/userAddress");
const mongoose = require("mongoose");

// =====================================
// GET ALL ADDRESSES
// GET /api/addresses
// =====================================

exports.getAddresses = async (
  req,
  res,
  next
) => {
  try {
    const addresses =
      await Address.find({
        user: req.user._id,
      }).sort({
        isDefault: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// CREATE ADDRESS
// POST /api/addresses
// =====================================

exports.createAddress = async (
  req,
  res,
  next
) => {
  try {
    const {
      type,
      fullName,
      addressLine,
      city,
      state,
      pinCode,
      phone,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !addressLine ||
      !city ||
      !pinCode ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, address, city, PIN code and phone are required",
      });
    }

    const existingCount =
      await Address.countDocuments({
        user: req.user._id,
      });

    const shouldBeDefault =
      isDefault === true ||
      existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany(
        {
          user: req.user._id,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    const address =
      await Address.create({
        user: req.user._id,
        type: type || "Home",
        fullName,
        addressLine,
        city,
        state,
        pinCode,
        phone,
        isDefault: shouldBeDefault,
      });

    return res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// UPDATE ADDRESS
// PUT /api/addresses/:id
// =====================================

exports.updateAddress = async (
  req,
  res,
  next
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      type,
      fullName,
      addressLine,
      city,
      state,
      pinCode,
      phone,
    } = req.body;

    if (type !== undefined)
      address.type = type;

    if (fullName !== undefined)
      address.fullName = fullName;

    if (addressLine !== undefined)
      address.addressLine = addressLine;

    if (city !== undefined)
      address.city = city;

    if (state !== undefined)
      address.state = state;

    if (pinCode !== undefined)
      address.pinCode = pinCode;

    if (phone !== undefined)
      address.phone = phone;

    await address.save();

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// SET DEFAULT ADDRESS
// PATCH /api/addresses/:id/default
// =====================================

exports.setDefaultAddress = async (
  req,
  res,
  next
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await Address.updateMany(
      {
        user: req.user._id,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    address.isDefault = true;

    await address.save();

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================
// DELETE ADDRESS
// DELETE /api/addresses/:id
// =====================================

exports.deleteAddress = async (
  req,
  res,
  next
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault =
      address.isDefault;

    await address.deleteOne();

    if (wasDefault) {
      const nextAddress =
        await Address.findOne({
          user: req.user._id,
        }).sort({
          createdAt: 1,
        });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};