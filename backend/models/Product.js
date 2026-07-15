
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative'],
  },
  productCode: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true,
  },
  fabricDetails: {
    type: String,
    trim: true,
  },
  availableSizes: [{
    type: String,
    trim: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Free Size'],
  }],
  availableColors: [{
    type: String,
    trim: true,
  }],
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  }],
  featuredImage: {
    type: String,
    default: '',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active',
  },
  sizeChart: [{
    size: String,
    chest: String,
    length: String,
    shoulder: String,
    sleeve: String,
  }],
  specifications: [{
    label: String,
    value: String,
  }],
  shippingInfo: {
    type: String,
    default: 'Free shipping on orders above Rs.999. Standard delivery within 5-7 business days.',
  },
  returnPolicy: {
    type: String,
    default: 'Returns accepted within 7 days of delivery for manufacturing defects. Items must be unworn with original tags.',
  },
  weight: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    let baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (this.productCode) {
      baseSlug = baseSlug + '-' + this.productCode.toLowerCase();
    }
    this.slug = baseSlug;
  }
  if (this.availableSizes && this.availableSizes.length > 0) {
    this.inStock = true;
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', productCode: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
