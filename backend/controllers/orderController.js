const Order = require("../models/userOrder");
const {
  isValidObjectId,
  buildPagination,
  paginationMeta,
} = require("../utils/helpers");

const { sendEmail } = require("../services/emailService");
const {
  sendWhatsAppMessage
} = require("../services/whatsappService");


// ===============================
// GET MY ORDERS
// ===============================

exports.getMyOrders = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      skip,
    } = buildPagination(
      req.query.page,
      req.query.limit
    );

    const [
      orders,
      total,
    ] = await Promise.all([
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
      pagination: paginationMeta(
        total,
        page,
        limit
      ),
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
    if (
      !isValidObjectId(req.params.id)
    ) {
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

    const order =
      await Order.findOne(query);

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

exports.createOrder = async (
  req,
  res,
  next
) => {
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
        message:
          "Complete shipping address is required",
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
        fullName:
          shippingAddress.fullName,

        email:
          shippingAddress.email,

        addressLine:
          shippingAddress.addressLine,

        city:
          shippingAddress.city,

        state:
          shippingAddress.state,

        pinCode:
          shippingAddress.pinCode,

        phone:
          shippingAddress.phone,
      },

      subtotal:
        subtotal || 0,

      discountAmount:
        discountAmount || 0,

      promoCode:
        promoCode || null,

      shippingCost:
        shippingCost || 0,

      total:
        total || 0,

      paymentMethod:
        paymentMethod || "COD",

      status: "Processing",

      paymentStatus: "Pending",
    });


    // ===============================
    // EMAIL ITEMS HTML
    // ===============================

    const itemsHtml = order.items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #ddd;">
              ${item.name}
            </td>

            <td style="padding:10px;border-bottom:1px solid #ddd;">
              ${item.size || "N/A"}
            </td>

            <td style="padding:10px;border-bottom:1px solid #ddd;">
              ${item.color || "N/A"}
            </td>

            <td style="padding:10px;border-bottom:1px solid #ddd;">
              ${item.qty}
            </td>

            <td style="padding:10px;border-bottom:1px solid #ddd;">
              ₹${item.price * item.qty}
            </td>
          </tr>
        `
      )
      .join("");


    // ===============================
    // ADMIN EMAIL
    // ===============================

    const adminEmailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:800px;margin:auto;">

        <h1 style="color:#0A7F6E;">
          New Order Received
        </h1>

        <h2>
          Order: ${order.orderNumber}
        </h2>

        <hr />

        <h3>Customer Details</h3>

        <p>
          <strong>Name:</strong>
          ${shippingAddress.fullName}
        </p>

        <p>
          <strong>Email:</strong>
          ${shippingAddress.email}
        </p>

        <p>
          <strong>Phone:</strong>
          ${shippingAddress.phone}
        </p>

        <h3>Shipping Address</h3>

        <p>
          ${shippingAddress.addressLine},
          ${shippingAddress.city},
          ${shippingAddress.state}
          - ${shippingAddress.pinCode}
        </p>

        <h3>Order Items</h3>

        <table
          style="width:100%;border-collapse:collapse;"
          border="1"
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Color</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <br />

        <p>
          <strong>Subtotal:</strong>
          ₹${subtotal || 0}
        </p>

        <p>
          <strong>Discount:</strong>
          ₹${discountAmount || 0}
        </p>

        <p>
          <strong>Shipping:</strong>
          ₹${shippingCost || 0}
        </p>

        <h2 style="color:#0A7F6E;">
          Total: ₹${total}
        </h2>

        <p>
          <strong>Payment Method:</strong>
          ${paymentMethod || "COD"}
        </p>

      </div>
    `;


    // ===============================
    // CUSTOMER EMAIL
    // ===============================

    const customerEmailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;">

        <h1 style="color:#0A7F6E;">
          Order Confirmed!
        </h1>

        <p>
          Hi ${shippingAddress.fullName},
        </p>

        <p>
          Thank you for shopping with
          <strong>Comfy Sport Wear</strong>.
        </p>

        <h2>
          Order Number:
          ${order.orderNumber}
        </h2>

        <p>
          Your order has been successfully placed
          and is currently being processed.
        </p>

        <hr />

        <h2>
          Total Amount:
          ₹${total}
        </h2>

        <p>
          Payment Method:
          ${paymentMethod || "COD"}
        </p>

        <p>
          Expected delivery:
          4-6 business days
        </p>

        <br />

        <p>
          Regards,<br />
          <strong>Comfy Sport Wear Team</strong>
        </p>

      </div>
    `;


    // ===============================
    // SEND EMAILS
    // ===============================

    const emailPromises = [];


    if (
      process.env.ADMIN_EMAIL
    ) {
      emailPromises.push(
        sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject:
            `New Order ${order.orderNumber}`,
          htmlContent:
            adminEmailHtml,
        })
      );
    }


    if (
      shippingAddress.email
    ) {
      emailPromises.push(
        sendEmail({
          to: shippingAddress.email,
          subject:
            `Order Confirmed - ${order.orderNumber}`,
          htmlContent:
            customerEmailHtml,
        })
      );
    }

// ===============================
// WHATSAPP ADMIN NOTIFICATION
// ===============================

if (
  process.env.ADMIN_WHATSAPP_NUMBER &&
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_WHATSAPP_FROM
) {
  const whatsappMessage = `
NEW ORDER RECEIVED

Order: ${order.orderNumber}

Customer:
${shippingAddress.fullName}

Email:
${shippingAddress.email}

Phone:
${shippingAddress.phone}

Address:
${shippingAddress.addressLine},
${shippingAddress.city},
${shippingAddress.state}
${shippingAddress.pinCode}

Items:
${order.items
  .map(
    (item) =>
      `${item.name} | Qty: ${item.qty} | ₹${item.price}`
  )
  .join("\n")}

Total:
₹${total}

Payment:
${paymentMethod || "COD"}
  `;

  emailPromises.push(
    sendWhatsAppMessage(
      process.env.ADMIN_WHATSAPP_NUMBER,
      whatsappMessage
    )
  );
}
    // Notification fail झाला तरी order fail करू नको
    await Promise.allSettled(
      emailPromises
    );


    // ===============================
    // RESPONSE
    // ===============================

    res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      data: order,
    });

  } catch (error) {
    next(error);
  }
};


// ===============================
// ADMIN GET ALL ORDERS
// ===============================

exports.getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const {
      page,
      limit,
      skip,
    } = buildPagination(
      req.query.page,
      req.query.limit
    );

    const filter = {};

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    const [
      orders,
      total,
    ] = await Promise.all([
      Order.find(filter)
        .populate(
          "user",
          "name email"
        )
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
      pagination: paginationMeta(
        total,
        page,
        limit
      ),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};


// ===============================
// UPDATE ORDER STATUS
// ===============================

exports.updateOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    if (
      !isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const {
      status,
    } = req.body;

    const allowed = [
      "Processing",
      "In Transit",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowed.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
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