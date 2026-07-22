const Order = require("../models/userOrder");
const {
  isValidObjectId,
  buildPagination,
  paginationMeta,
} = require("../utils/helpers");

const { sendOrderConfirmationEmail } = require("../services/emailService");
const { sendOrderConfirmationWhatsApp } = require("../services/whatsappService");

// ===============================
// GET MY ORDERS
// ===============================
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(
      req.query.page,
      req.query.limit
    );

    const [orders, total] = await Promise.all([
      Order.find({
        user: req.user.id,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Order.countDocuments({
        user: req.user.id,
      }),
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

// ===============================
// GET SINGLE ORDER
// ===============================
exports.getOrder = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const query =
      req.user.role === "admin"
        ? {
            _id: req.params.id,
          }
        : {
            _id: req.params.id,
            user: req.user.id,
          };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// CREATE ORDER
// ===============================
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      discountAmount,
      promoCode,
      total,
      shippingCost,
      paymentMethod,
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================
    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // ===============================
    // CREATE ORDER
    // ===============================
    const order = await Order.create({
      user: req.user.id,

      items: items.map((item) => ({
        product: item.product,
        name: item.productName || item.name,
        code: item.productCode || item.code,
        image: item.image,
        size: item.size,
        color: item.color,
        qty: item.qty || item.quantity,
        price: item.price,
      })),

      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pinCode: shippingAddress.pinCode,
      },

      subtotal: subtotal || 0,
      discountAmount: discountAmount || 0,
      promoCode: promoCode || null,
      shippingCost: shippingCost || 0,
      total: total || 0,
      paymentMethod: paymentMethod || "COD",
      status: "Processing",
      paymentStatus: "Pending",
    });

    // ===============================
    // PREPARE ORDER DATA FOR EMAILS
    // ===============================
    const orderData = {
      orderId: order._id,
      customerName: shippingAddress.fullName,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      total: order.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
    };

    // ===============================
    // SEND NOTIFICATIONS (Non-blocking)
    // ===============================
    const notificationPromises = [];

    // Send customer email
    if (shippingAddress.email) {
      notificationPromises.push(
        sendOrderConfirmationEmail(orderData).catch((err) => {
          console.error("Order confirmation email failed:", err.message);
          // Don't throw - order creation should succeed even if email fails
        })
      );
    }

    // Send customer WhatsApp
    if (shippingAddress.phone && process.env.TWILIO_ACCOUNT_SID) {
      notificationPromises.push(
        sendOrderConfirmationWhatsApp(shippingAddress.phone, orderData).catch(
          (err) => {
            console.error("Order WhatsApp notification failed:", err.message);
            // Don't throw - order creation should succeed even if WhatsApp fails
          }
        )
      );
    }

    // Send admin email (optional)
    if (process.env.ADMIN_EMAIL) {
      const adminData = {
        ...orderData,
        shippingAddress: {
          email: process.env.ADMIN_EMAIL,
          ...orderData.shippingAddress,
        },
      };
      
      // You could use a different email template for admin here
      // For now, reusing the same template
      notificationPromises.push(
        sendOrderConfirmationEmail(adminData).catch((err) => {
          console.error("Admin order notification failed:", err.message);
        })
      );
    }

    // Execute all notifications in parallel (non-blocking)
    await Promise.allSettled(notificationPromises);

    // ===============================
    // RESPONSE
    // ===============================
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// ADMIN GET ALL ORDERS
// ===============================
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(
      req.query.page,
      req.query.limit
    );

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

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

// ===============================
// UPDATE ORDER STATUS
// ===============================
exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { status } = req.body;

    const allowed = ["Processing", "In Transit", "Delivered", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// DELETE ORDER
// ===============================
exports.deleteOrder = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id };

    const order = await Order.findOneAndDelete(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not authorized to delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};