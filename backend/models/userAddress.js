const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Home', 'Office', 'Other'],
    default: 'Home',
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  addressLine: {
    type: String,
    required: [true, 'Address line is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    required: [true, 'PIN code is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

addressSchema.index({ user: 1 });

module.exports = mongoose.model('Address', addressSchema);