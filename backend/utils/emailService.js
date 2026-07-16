const { BrevoClient } = require('@getbrevo/brevo');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Comfy Sport Wear';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://comfysportwear.com';

let brevoClient = null;
if (process.env.BREVO_API_KEY) {
  try {
    brevoClient = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  } catch (err) {
    console.error("Failed to initialize Brevo email client:", err.message);
  }
} else {
  console.warn("BREVO_API_KEY is not defined in .env. Email services will run in fallback mock mode.");
}

const sendEmail = async (to, subject, htmlContent) => {
  if (!brevoClient) {
    console.log(`[Email Mock Fallback] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    await brevoClient.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      replyTo: { email: SENDER_EMAIL, name: SENDER_NAME }
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

const sendInquiryNotification = async (inquiry) => {
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#000000;padding:20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:24px">COMFY SPORT WEAR</h1>
        <p style="color:#FF3B30;margin:5px 0 0;font-size:14px">New Product Inquiry</p>
      </div>
      <div style="padding:24px;background:#ffffff">
        <h2 style="color:#0A2540;margin-top:0">New Inquiry Received</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555;width:140px">Name:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${inquiry.name}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Mobile:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${inquiry.mobileNumber}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Email:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333"><a href="mailto:${inquiry.email}" style="color:#FF3B30">${inquiry.email}</a></td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Product:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${inquiry.productName || 'N/A'}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Quantity:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${inquiry.quantity || 'N/A'}</td></tr>
          <tr><td style="padding:10px;font-weight:600;color:#555;vertical-align:top">Message:</td><td style="padding:10px;color:#333">${inquiry.message || 'No message'}</td></tr>
        </table>
        <div style="margin-top:20px;text-align:center">
          <a href="${WEBSITE_URL}/admin/inquiries" style="background:#FF3B30;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600">View in Dashboard</a>
        </div>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#888">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
    </div>
  `;

  await sendEmail(ADMIN_EMAIL, `New Inquiry: ${inquiry.name} - ${inquiry.productName || 'General'}`, html);
};

const sendInquiryAckToCustomer = async (inquiry) => {
  const ref = `#INQ-${inquiry._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#000000;padding:20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:24px">COMFY SPORT WEAR</h1>
        <p style="color:#FF3B30;margin:5px 0 0;font-size:14px">Performance Meets Comfort</p>
      </div>
      <div style="padding:24px;background:#ffffff">
        <h2 style="color:#0A2540;margin-top:0">Thank You, ${inquiry.name}!</h2>
        <p style="color:#555;line-height:1.6">We have received your inquiry regarding <strong>${inquiry.productName || 'our products'}</strong>. Our team will review your request and get back to you within <strong>24 hours</strong>.</p>
        <div style="background:#f9f9f9;border-left:4px solid #FF3B30;padding:16px;margin:20px 0;border-radius:0 6px 6px 0">
          <p style="margin:0;color:#555;font-size:14px"><strong>Inquiry Reference:</strong> ${ref}</p>
        </div>
        <p style="color:#555;line-height:1.6">In the meantime, feel free to browse our complete collection or reach out to us directly.</p>
      </div>
      <div style="background:#0A2540;padding:16px;text-align:center">
        <p style="color:#ffffff;margin:0;font-size:13px">Comfy Sport Wear &copy; ${new Date().getFullYear()} | Premium Sportswear for Athletes & Teams</p>
      </div>
    </div>
  `;

  await sendEmail(inquiry.email, `We received your inquiry - Comfy Sport Wear`, html);
};

const sendBulkOrderNotification = async (order) => {
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#FF3B30;padding:20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:24px">BULK ORDER REQUEST</h1>
        <p style="color:#ffffff;margin:5px 0 0;font-size:14px;opacity:0.9">Comfy Sport Wear</p>
      </div>
      <div style="padding:24px;background:#ffffff">
        <h2 style="color:#0A2540;margin-top:0">New Bulk Order Request</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555;width:160px">Contact Person:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.fullName}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Organization:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.organizationName || 'N/A'}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Phone:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.phoneNumber}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Email:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.emailAddress}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Category:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.productCategory}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Quantity:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333;font-weight:700;font-size:18px">${order.quantityRequired} pcs</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Custom Printing:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.customPrinting ? 'Yes' : 'No'}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Delivery Date:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${order.preferredDeliveryDate || 'Not specified'}</td></tr>
          <tr><td style="padding:10px;font-weight:600;color:#555;vertical-align:top">Requirements:</td><td style="padding:10px;color:#333">${order.additionalRequirements || 'None'}</td></tr>
        </table>
        <div style="margin-top:20px;text-align:center">
          <a href="${WEBSITE_URL}/admin/bulk-orders" style="background:#0A2540;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600">View in Dashboard</a>
        </div>
      </div>
    </div>
  `;

  await sendEmail(ADMIN_EMAIL, `BULK ORDER: ${order.organizationName || order.fullName} - ${order.quantityRequired} ${order.productCategory}`, html);
};

const sendBulkOrderAckToCustomer = async (order) => {
  const ref = `#BULK-${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#000000;padding:20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:24px">COMFY SPORT WEAR</h1>
        <p style="color:#FF3B30;margin:5px 0 0;font-size:14px">Bulk Order Request Received</p>
      </div>
      <div style="padding:24px;background:#ffffff">
        <h2 style="color:#0A2540;margin-top:0">Thank You, ${order.fullName}!</h2>
        <p style="color:#555;line-height:1.6">We have received your bulk order request for <strong>${order.quantityRequired} ${order.productCategory}</strong>. Our B2B team will review your requirements and contact you within <strong>24 hours</strong> with a detailed quotation.</p>
        <div style="background:#f9f9f9;border-left:4px solid #FF3B30;padding:16px;margin:20px 0;border-radius:0 6px 6px 0">
          <p style="margin:0;color:#555;font-size:14px"><strong>Order Reference:</strong> ${ref}</p>
        </div>
        <p style="color:#555;line-height:1.6">For urgent requirements, please contact us directly on WhatsApp or call us.</p>
      </div>
      <div style="background:#0A2540;padding:16px;text-align:center">
        <p style="color:#ffffff;margin:0;font-size:13px">Comfy Sport Wear &copy; ${new Date().getFullYear()} | Premium Sportswear for Athletes & Teams</p>
      </div>
    </div>
  `;

  await sendEmail(order.emailAddress, `Bulk Order Request Received - Comfy Sport Wear`, html);
};

const sendContactNotification = async (contact) => {
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#0A2540;padding:20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:24px">COMFY SPORT WEAR</h1>
        <p style="color:#FF3B30;margin:5px 0 0;font-size:14px">New Contact Message</p>
      </div>
      <div style="padding:24px;background:#ffffff">
        <h2 style="color:#0A2540;margin-top:0">Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555;width:120px">Name:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${contact.name}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Email:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${contact.email}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Phone:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${contact.phone || 'N/A'}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#555">Subject:</td><td style="padding:10px;border-bottom:1px solid #f0f0f0;color:#333">${contact.subject || 'No subject'}</td></tr>
          <tr><td style="padding:10px;font-weight:600;color:#555;vertical-align:top">Message:</td><td style="padding:10px;color:#333">${contact.message}</td></tr>
        </table>
      </div>
    </div>
  `;

  await sendEmail(ADMIN_EMAIL, `Contact: ${contact.subject || contact.name} - Comfy Sport Wear`, html);
};

const sendContactAckToUser = async (contact) => {
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
      <div style="background:#000000;padding:20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:24px">COMFY SPORT WEAR</h1>
      </div>
      <div style="padding:24px;background:#ffffff">
        <h2 style="color:#0A2540;margin-top:0">Thank You, ${contact.name}!</h2>
        <p style="color:#555;line-height:1.6">We have received your message. Our team will respond to you within <strong>24 hours</strong>.</p>
        <p style="color:#555;line-height:1.6">For immediate assistance, feel free to reach out via WhatsApp or phone.</p>
      </div>
      <div style="background:#0A2540;padding:16px;text-align:center">
        <p style="color:#ffffff;margin:0;font-size:13px">Comfy Sport Wear &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  await sendEmail(contact.email, `We received your message - Comfy Sport Wear`, html);
};

module.exports = {
  sendInquiryNotification,
  sendInquiryAckToCustomer,
  sendBulkOrderNotification,
  sendBulkOrderAckToCustomer,
  sendContactNotification,
  sendContactAckToUser,
};
