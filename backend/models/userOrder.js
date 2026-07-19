const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: { type: String, required: true },
  code: { type: String },
  image: { type: String },
  size: { type: String },
  color: { type: String },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // unit price at time of order
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [orderItemSchema],
    validate: [(arr) => arr.length > 0, 'Order must have at least one item'],
  },
  shippingAddress: {
    fullName: String,
    addressLine: String,
    city: String,
    state: String,
    pinCode: String,
    phone: String,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Processing', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

// Auto-generate a human-readable order number, e.g. #CS-82049
orderSchema.pre('save', async function () {
  if (this.isNew && !this.orderNumber) {
    const rand = Math.floor(10000 + Math.random() * 89999);
    this.orderNumber = `#CS-${rand}`;
  }
});

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);