const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  organizationName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  productCategory: { type: String, required: true },
  quantityRequired: { type: Number, required: true, min: 1 },
  customPrinting: { type: Boolean, default: false },
  preferredDeliveryDate: { type: Date },
  additionalRequirements: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Quoted', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
