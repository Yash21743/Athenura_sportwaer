const Cart = require('../models/userCart');
const Product = require('../models/Product');
const { isValidObjectId } = require('../utils/helpers');

// Helper — get or create the user's cart doc
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.status(200).json({ success: true, data: cart.items });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart — add item (or bump quantity if same product+size+color exists)
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, size, color, quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const qty = quantity && quantity > 0 ? parseInt(quantity, 10) : 1;
    const itemSize = size || 'Default';
    const itemColor = color || 'Default';

    const existing = cart.items.find(
      (it) => it.product.toString() === productId && it.size === itemSize && it.color === itemColor
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        code: product.productCode || '',
        image: (product.images && product.images[0] && product.images[0].url) || product.featuredImage || '',
        price: product.price,
        size: itemSize,
        color: itemColor,
        quantity: qty,
      });
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart.items });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart — update quantity of a specific line item
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, size, color, quantity } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const itemSize = size || 'Default';
    const itemColor = color || 'Default';

    const item = cart.items.find(
      (it) => it.product.toString() === productId && it.size === itemSize && it.color === itemColor
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    item.quantity = parseInt(quantity, 10);
    await cart.save();

    res.status(200).json({ success: true, data: cart.items });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart — remove a specific line item
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const itemSize = size || 'Default';
    const itemColor = color || 'Default';

    cart.items = cart.items.filter(
      (it) => !(it.product.toString() === productId && it.size === itemSize && it.color === itemColor)
    );

    await cart.save();
    res.status(200).json({ success: true, data: cart.items });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/clear — empty the whole cart (e.g. after checkout)
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};