const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppMessage = async (
  to,
  message
) => {
  try {
    // Remove any existing whatsapp: prefix
    const cleanNumber = String(to)
      .replace(/^whatsapp:/, "")
      .trim();

    const response =
      await client.messages.create({
        from:
          process.env.TWILIO_WHATSAPP_FROM,

        to: `whatsapp:${cleanNumber}`,

        body: message,
      });

    console.log(
      "WhatsApp message sent successfully:",
      response.sid
    );

    return response;
  } catch (error) {
    console.error(
      "WhatsApp Error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  sendWhatsAppMessage,
};