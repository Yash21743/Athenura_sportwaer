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
    default: null,
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Unisex'],
    default: 'Unisex',
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
    publicId: { type: String, default: 'local' },
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
  // ✅ ADDED: these were missing, so stock data from the admin form was silently dropped
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock',
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

// Async pre-save hook (no 'next' param needed — avoids the "next is not a function" crash)
productSchema.pre('save', async function () {
  if (this.isModified('name') || this.isNew) {
    let baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (this.productCode) {
      baseSlug = baseSlug + '-' + this.productCode.toLowerCase();
    }
    this.slug = baseSlug;
  }

  // ✅ FIXED: inStock now derives from actual stock count, not just size availability
  if (this.isModified('stock')) {
    if (this.stock === 0) {
      this.inStock = false;
      this.stockStatus = 'Out of Stock';
    } else if (this.stock <= 10) {
      this.inStock = true;
      this.stockStatus = 'Low Stock';
    } else {
      this.inStock = true;
      this.stockStatus = 'In Stock';
    }
  }
});

productSchema.index({ name: 'text', description: 'text', productCode: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ gender: 1, status: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);