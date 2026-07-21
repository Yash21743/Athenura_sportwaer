const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      default: '',
    },

    image: {
      type: String,
      default: '',
    },

    size: {
      type: String,
      default: '',
    },

    color: {
      type: String,
      default: '',
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
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
      validate: [
        (arr) => arr.length > 0,
        'Order must have at least one item',
      ],
    },

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      addressLine: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pinCode: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    promoCode: {
      type: String,
      default: null,
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'Processing',
        'Confirmed',
        'In Transit',
        'Delivered',
        'Cancelled',
      ],
      default: 'Processing',
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'Online'],
      default: 'COD',
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
  },

  {
    timestamps: true,
  }
);

orderSchema.pre('save', async function () {
  if (this.isNew && !this.orderNumber) {
    const randomNumber = Math.floor(
      10000 + Math.random() * 89999
    );

    this.orderNumber = `#CS-${randomNumber}`;
  }
});

orderSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model('Order', orderSchema);