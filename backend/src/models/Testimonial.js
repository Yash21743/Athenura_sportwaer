const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  organization: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
