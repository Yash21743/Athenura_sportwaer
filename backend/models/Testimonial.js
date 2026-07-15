
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
  },
  organization: {
    type: String,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
