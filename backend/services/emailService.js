const SibApiV3Sdk = require("sib-api-v3-sdk");

const apiClient = SibApiV3Sdk.ApiClient.instance;
apiClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================================
// CORE SENDER
// ================================
const sendEmail = async ({
  to,
  subject,
  htmlContent,
  textContent,
}) => {
  try {
    const email = new SibApiV3Sdk.SendSmtpEmail();

    email.sender = {
      name: "Comfy Sport Wear",
      email: process.env.BREVO_SENDER_EMAIL,
    };

    email.to = [{ email: to }];
    email.subject = subject;
    email.htmlContent = htmlContent;

    if (textContent) {
      email.textContent = textContent;
    }

    const response = await transactionalEmailsApi.sendTransacEmail(email);
    console.log(`Email sent successfully to ${to}`);
    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error.response?.body || error.message);
    throw error;
  }
};

// ================================
// TEMPLATE: ORDER CONFIRMATION EMAIL
// ================================
const buildOrderConfirmationEmailHtml = (order) => {
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

  const LOGO_URL = process.env.LOGO_URL || "https://your-domain.com/comfy-logo.png";

  // Build items table rows
  const itemsRows = items
    .map((item) => {
      const qty = item.qty || item.quantity;
      const lineTotal = (Number(item.price) * Number(qty)).toLocaleString("en-IN");
      const itemPrice = Number(item.price).toLocaleString("en-IN");

      return `
        <tr>
          <td style="padding: 15px 12px; border-bottom: 1px solid #e5e5e5; text-align: left;">
            <div style="font-weight: 600; color: #1a1a1a; font-size: 14px; margin-bottom: 6px;">
              ${item.name}
            </div>
            <div style="font-size: 12px; color: #666;">
              ${item.code ? `Code: ${item.code} | ` : ""}${
        item.size ? `Size: ${item.size}` : ""
      }${item.size && item.color ? " | " : ""}${item.color ? `Color: ${item.color}` : ""}
            </div>
          </td>
          <td style="padding: 15px 12px; border-bottom: 1px solid #e5e5e5; text-align: center; font-size: 14px; color: #1a1a1a;">
            ${qty}
          </td>
          <td style="padding: 15px 12px; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 14px; color: #1a1a1a;">
            ₹${itemPrice}
          </td>
          <td style="padding: 15px 12px; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600; color: #0a7f6e; font-size: 14px;">
            ₹${lineTotal}
          </td>
        </tr>
      `;
    })
    .join("");

  const address = [
    shippingAddress.addressLine,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  const orderDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa; }
      table { border-collapse: collapse; }
      a { color: #0a7f6e; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background: #f8f9fa;">
    
    <!-- OUTER WRAPPER -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa;">
      <tr>
        <td align="center" style="padding: 20px;">
          
          <!-- MAIN CONTAINER -->
          <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            
            <!-- HEADER WITH LOGO -->
            <tr style="background: linear-gradient(135deg, #0a7f6e 0%, #14a889 100%);">
              <td align="center" style="padding: 30px 20px;">
                <img src="${LOGO_URL}" alt="Comfy Sport Wear" width="160" height="auto" style="display: block; max-width: 160px; height: auto;">
              </td>
            </tr>

            <!-- CONTENT SECTION -->
            <tr>
              <td style="padding: 0;">
                
                <!-- ORDER STATUS -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr style="background: #f0faf7;">
                    <td style="padding: 25px 30px;">
                      <h1 style="margin: 0 0 8px 0; color: #0a7f6e; font-size: 24px; font-weight: 700;">
                        ✅ Order Confirmed
                      </h1>
                      <p style="margin: 0; color: #666; font-size: 14px;">
                        Your order has been placed successfully. We'll keep you updated!
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- ORDER INFO -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 25px 30px;">
                      <p style="margin: 0 0 18px 0; color: #1a1a1a; font-size: 14px;">
                        Hi <strong>${customerName || "there"}</strong>,
                      </p>
                      
                      <!-- ORDER DETAILS GRID -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 12px 0; width: 50%;">
                            <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</span>
                            <div style="margin-top: 4px; color: #0a7f6e; font-weight: 600; font-size: 16px;">
                              #${orderId}
                            </div>
                          </td>
                          <td style="padding: 12px 0; width: 50%; padding-left: 20px;">
                            <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Date</span>
                            <div style="margin-top: 4px; color: #1a1a1a; font-weight: 500; font-size: 14px;">
                              ${orderDate}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- ITEMS TABLE -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 30px;">
                      <h3 style="margin: 25px 0 15px 0; color: #1a1a1a; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Order Items (${items.length})
                      </h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <thead>
                          <tr style="border-bottom: 2px solid #e5e5e5;">
                            <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                              Product
                            </th>
                            <th style="padding: 12px; text-align: center; font-weight: 600; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                              Qty
                            </th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                              Price
                            </th>
                            <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- BILLING SUMMARY -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Bill Summary
                      </h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-size: 13px;">Subtotal</td>
                          <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-size: 13px; font-weight: 500;">
                            ₹${Number(subtotal || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                        ${
                          discountAmount
                            ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666; font-size: 13px;">Discount</td>
                            <td style="padding: 8px 0; text-align: right; color: #e74c3c; font-size: 13px; font-weight: 500;">
                              -₹${Number(discountAmount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        `
                            : ""
                        }
                        <tr>
                          <td style="padding: 8px 0; color: #666; font-size: 13px;">Shipping</td>
                          <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-size: 13px; font-weight: 500;">
                            ${
                              shippingCost && shippingCost > 0
                                ? `₹${shippingCost}`
                                : `<span style="color: #27ae60;">FREE</span>`
                            }
                          </td>
                        </tr>
                        <tr style="border-top: 2px solid #e5e5e5; border-bottom: 2px solid #e5e5e5;">
                          <td style="padding: 15px 0; color: #1a1a1a; font-size: 15px; font-weight: 700;">Total Amount</td>
                          <td style="padding: 15px 0; text-align: right; color: #0a7f6e; font-size: 18px; font-weight: 700;">
                            ₹${Number(total || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- DELIVERY INFO -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa;">
                  <tr>
                    <td style="padding: 25px 30px;">
                      
                      <!-- ADDRESS -->
                      <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                          📍 Delivery Address
                        </h4>
                        <div style="color: #1a1a1a; font-size: 13px; line-height: 1.6;">
                          <strong>${shippingAddress.fullName}</strong><br/>
                          ${address}<br/>
                          📞 ${shippingAddress.phone}
                        </div>
                      </div>

                      <!-- PAYMENT & DELIVERY -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 10px 0; width: 50%;">
                            <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</span>
                            <div style="margin-top: 4px; color: #1a1a1a; font-weight: 500; font-size: 13px;">
                              ${paymentMethod || "Cash on Delivery"}
                            </div>
                          </td>
                          <td style="padding: 10px 0 10px 20px; width: 50%;">
                            <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Delivery</span>
                            <div style="margin-top: 4px; color: #1a1a1a; font-weight: 500; font-size: 13px;">
                              4–6 Business Days
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA & SUPPORT -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 30px; text-align: center; border-top: 1px solid #e5e5e5;">
                      <a href="https://your-domain.com/orders/${orderId}" style="display: inline-block; padding: 12px 30px; background: #0a7f6e; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; margin-bottom: 15px;">
                        View Order Details
                      </a>
                      <p style="margin: 0; color: #666; font-size: 12px; line-height: 1.6;">
                        Have questions? <a href="mailto:support@comfysport.com">Contact our support team</a> or reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr style="background: #1a1a1a;">
              <td style="padding: 25px 30px; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #fff; font-size: 13px; font-weight: 600;">
                  🏆 Thank you for choosing Comfy Sport Wear
                </p>
                <p style="margin: 0; color: #999; font-size: 11px;">
                  Performance • Comfort • Style
                </p>
                <table cellpadding="0" cellspacing="0" style="margin-top: 12px;">
                  <tr>
                    <td style="padding: 0 8px;">
                      <a href="https://your-domain.com" style="color: #0a7f6e; font-size: 11px;">Website</a>
                    </td>
                    <td style="padding: 0 8px; border-left: 1px solid #444;">
                      <a href="https://instagram.com/comfysport" style="color: #0a7f6e; font-size: 11px;">Instagram</a>
                    </td>
                    <td style="padding: 0 8px; border-left: 1px solid #444;">
                      <a href="https://facebook.com/comfysport" style="color: #0a7f6e; font-size: 11px;">Facebook</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

// ================================
// WRAPPER: SEND ORDER CONFIRMATION
// ================================
const sendOrderConfirmationEmail = async (order) => {
  const html = buildOrderConfirmationEmailHtml(order);

  return sendEmail({
    to: order.shippingAddress?.email,
    subject: `✅ Order Confirmed — #${order.orderId} | Comfy Sport Wear`,
    htmlContent: html,
    textContent: `Order Confirmed! Order ID: ${order.orderId}, Total: ₹${order.total}. Thank you for shopping with Comfy Sport Wear.`,
  });
};

module.exports = {
  sendEmail,
  buildOrderConfirmationEmailHtml,
  sendOrderConfirmationEmail,
};