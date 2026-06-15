const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Sports T-Shirts', 'Jerseys', 'Team Uniforms',
      'Sports Shorts', 'Track Pants', 'Hoodies',
      'Tracksuits', 'Custom Team Kits', 'Accessories'
    ]
  },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  fabric: { type: String },
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] }],
  colors: [{ type: String }],
  images: [{ type: String }],        // image file paths
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Limited Stock'],
    default: 'In Stock'
  },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
