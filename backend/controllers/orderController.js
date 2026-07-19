const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const { isValidObjectId, buildPagination, paginationMeta } = require('../utils/helpers');

// GET /api/orders — logged-in user's own orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments({ user: req.user.id }),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: paginationMeta(total, page, limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id — single order (must belong to user, or be admin)
exports.getOrder = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const query = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders — place an order from the user's current cart
exports.createOrder = async (req, res, next) => {
  try {
    const { addressId, paymentMethod } = req.body;

    if (!isValidObjectId(addressId)) {
      return res.status(400).json({ success: false, message: 'Valid shipping address is required' });
    }

    const [cart, address] = await Promise.all([
      Cart.findOne({ user: req.user.id }),
      Address.findOne({ _id: addressId, user: req.user.id }),
    ]);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }
    if (!address) {
      return res.status(404).json({ success: false, message: 'Shipping address not found' });
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        code: item.code,
        image: item.image,
        size: item.size,
        color: item.color,
        qty: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        fullName: address.fullName,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        phone: address.phone,
      },
      total,
      paymentMethod: paymentMethod || 'COD',
      status: 'Processing',
    });

    // Clear the cart after order placement
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ── Admin ──
// GET /api/orders/admin/all
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(req.query.page, req.query.limit);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: paginationMeta(total, page, limit),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/admin/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const { status } = req.body;
    const allowed = ['Processing', 'In Transit', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};