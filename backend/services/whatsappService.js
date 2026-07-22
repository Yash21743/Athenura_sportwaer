const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ================================
// CORE SENDER
// ================================
const sendWhatsAppMessage = async (to, message) => {
  try {
    const cleanNumber = String(to)
      .replace(/^whatsapp:/, "")
      .trim();

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${cleanNumber}`,
      body: message,
    });

    console.log("WhatsApp message sent successfully:", response.sid);

    return response;
  } catch (error) {
    console.error("WhatsApp Error:", error.message);
    throw error;
  }
};

// ================================
// TEMPLATE: FULL ORDER CONFIRMATION
// ================================
const buildOrderConfirmationText = (order) => {
  const {
    orderId,
    customerName,
    items = [],
    subtotal,
    shippingCost,
    discountAmount,
    total,
    paymentMethod,
    shippingAddress = {},
  } = order;

  const itemLines = items
    .map((item, index) => {
      const qty = item.qty || item.quantity;
      const lineTotal = (
        Number(item.price) * Number(qty)
      ).toLocaleString("en-IN");

      const variant = [
        item.size ? `Size: ${item.size}` : null,
        item.color ? `Color: ${item.color}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      return `┌─────────────────
│ ${index + 1}. *${item.name}*
│ ${item.code ? `Code: ${item.code}\n│ ` : ""}${variant || "Standard"}
│ Qty: ${qty} × ₹${Number(item.price).toLocaleString("en-IN")}
│ Item Total: ₹${lineTotal}
└─────────────────`;
    })
    .join("\n");

  const address = [
    shippingAddress.addressLine,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return `🧡💚🤍 *COMFY SPORT* 🤍💚🧡
━━━━━━━━━━━━━━━━━━━
✅ *ORDER CONFIRMED*
━━━━━━━━━━━━━━━━━━━

Hi *${customerName || "there"}* 👋
Thank you for shopping with us! Your order has been placed successfully.

📦 *Order ID:* #${orderId}
📅 *Order Date:* ${new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}

━━━━━━━━━━━━━━━━━━━
🛍️ *ORDER ITEMS* (${items.length})
━━━━━━━━━━━━━━━━━━━
${itemLines}

━━━━━━━━━━━━━━━━━━━
💰 *BILL SUMMARY*
━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${Number(subtotal || 0).toLocaleString("en-IN")}
${
  discountAmount
    ? `Discount: -₹${Number(discountAmount).toLocaleString("en-IN")}\n`
    : ""
}Shipping: ${shippingCost ? `₹${shippingCost}` : "FREE ✅"}
━━━━━━━━━━━━━━━━━━━
*Total: ₹${Number(total || 0).toLocaleString("en-IN")}*
━━━━━━━━━━━━━━━━━━━

📍 *Delivery Address*
${shippingAddress.fullName}
${address}
📞 ${shippingAddress.phone}

💳 *Payment Method:* ${paymentMethod || "Cash on Delivery"}
🚚 *Estimated Delivery:* 4–6 Business Days

━━━━━━━━━━━━━━━━━━━
We'll notify you here once your order is shipped.

Need help? Just reply to this message.

Thank you for choosing *COMFY SPORT* 🏆
_Performance. Comfort. Style._`;
};

// ================================
// WRAPPER: SEND ORDER CONFIRMATION
// ================================
const sendOrderConfirmationWhatsApp = async (phone, order) => {
  const message = buildOrderConfirmationText(order);
  return sendWhatsAppMessage(phone, message);
};

module.exports = {
  sendWhatsAppMessage,
  buildOrderConfirmationText,
  sendOrderConfirmationWhatsApp,
};