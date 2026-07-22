const SibApiV3Sdk = require("sib-api-v3-sdk");
const config = require("../config");

let brevoClient;

try {
  if (!config.brevo.apiKey) {
    throw new Error("BREVO_API_KEY is missing in .env");
  }

  SibApiV3Sdk.ApiClient.instance.authentications[
    "api-key"
  ].apiKey = config.brevo.apiKey;

  brevoClient =
    new SibApiV3Sdk.TransactionalEmailsApi();

  console.log("✅ Brevo email service initialized");
} catch (error) {
  console.error(
    "❌ Brevo initialization error:",
    error.message
  );
}

const sendEmail = async ({
  to,
  subject,
  htmlContent,
  textContent,
}) => {
  try {
    if (!brevoClient) {
      throw new Error(
        "Brevo client is not initialized"
      );
    }

    const email =
      new SibApiV3Sdk.SendSmtpEmail();

    email.sender = {
      name:
        config.brevo.senderName ||
        "Athenura Sportwear",

      email: config.brevo.senderEmail,
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;

    email.htmlContent =
      htmlContent ||
      `<p>${textContent || ""}</p>`;

    if (textContent) {
      email.textContent = textContent;
    }

    const response =
      await brevoClient.sendTransacEmail(email);

    console.log(
      `✅ Email sent successfully to: ${to}`
    );

    return response;
  } catch (error) {
    console.error(
      "❌ Brevo email error:",
      error.response?.body ||
        error.message
    );

    throw error;
  }
};

const sendInquiryNotification = async (inquiry) => {
  try {
    if (!config.brevo.senderEmail) return;
    await sendEmail({
      to: config.brevo.senderEmail,
      subject: `New Inquiry from ${inquiry.name}`,
      htmlContent: `<p>New inquiry received from ${inquiry.name} (${inquiry.email}). Message: ${inquiry.message || ''}</p>`,
    });
  } catch (err) {
    console.warn("Inquiry notification email failed:", err.message);
  }
};

const sendInquiryAckToCustomer = async (inquiry) => {
  try {
    if (!inquiry.email) return;
    await sendEmail({
      to: inquiry.email,
      subject: `Thank you for your inquiry - Athenura Sportswear`,
      htmlContent: `<p>Hi ${inquiry.name},<br/>We have received your inquiry and will contact you shortly.</p>`,
    });
  } catch (err) {
    console.warn("Inquiry ack email failed:", err.message);
  }
};

const sendBulkOrderNotification = async (order) => {
  try {
    if (!config.brevo.senderEmail) return;
    await sendEmail({
      to: config.brevo.senderEmail,
      subject: `New Bulk Order from ${order.fullName}`,
      htmlContent: `<p>New bulk order received from ${order.fullName} (${order.emailAddress}). Qty: ${order.quantityRequired}</p>`,
    });
  } catch (err) {
    console.warn("Bulk order notification email failed:", err.message);
  }
};

const sendBulkOrderAckToCustomer = async (order) => {
  try {
    if (!order.emailAddress) return;
    await sendEmail({
      to: order.emailAddress,
      subject: `Bulk Order Confirmation - Athenura Sportswear`,
      htmlContent: `<p>Hi ${order.fullName},<br/>Thank you for requesting a bulk order quotation. Our B2B team will reach out within 24 hours.</p>`,
    });
  } catch (err) {
    console.warn("Bulk order ack email failed:", err.message);
  }
};

const sendContactNotification = async (contact) => {
  try {
    if (!config.brevo.senderEmail) return;
    await sendEmail({
      to: config.brevo.senderEmail,
      subject: `New Contact Form Query from ${contact.name}`,
      htmlContent: `<p>New contact form query from ${contact.name} (${contact.email}). Subject: ${contact.subject || 'N/A'}</p><p>Message: ${contact.message}</p>`,
    });
  } catch (err) {
    console.warn("Contact notification email failed:", err.message);
  }
};

const sendContactAckToUser = async (contact) => {
  try {
    if (!contact.email) return;
    await sendEmail({
      to: contact.email,
      subject: `Message Received - Athenura Sportswear`,
      htmlContent: `<p>Hi ${contact.name},<br/>Thank you for contacting us. We have received your message and will get back to you soon.</p>`,
    });
  } catch (err) {
    console.warn("Contact ack email failed:", err.message);
  }
};

module.exports = {
  sendEmail,
  sendInquiryNotification,
  sendInquiryAckToCustomer,
  sendBulkOrderNotification,
  sendBulkOrderAckToCustomer,
  sendContactNotification,
  sendContactAckToUser,
};