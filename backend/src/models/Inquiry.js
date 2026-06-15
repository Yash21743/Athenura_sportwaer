const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  productName: { type: String },
  quantity: { type: Number },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['General', 'Bulk Order', 'Product Inquiry'],
    default: 'General'
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Follow Up', 'Closed'],
    default: 'New'
  },
  notes: { type: String }   // admin internal notes
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
