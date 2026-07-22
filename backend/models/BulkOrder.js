
const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  organizationName: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  emailAddress: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  productCategory: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  quantityRequired: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  customPrinting: {
    type: Boolean,
    default: false,
  },
  preferredDeliveryDate: {
    type: Date,
  },
  additionalRequirements: {
    type: String,
    trim: true,
    maxlength: [2000, 'Requirements cannot exceed 2000 characters'],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'quoted', 'confirmed', 'in-production', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    trim: true,
  },
  quotedPrice: {
    type: Number,
  },
}, {
  timestamps: true,
});

bulkOrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
