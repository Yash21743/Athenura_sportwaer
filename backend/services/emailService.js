const SibApiV3Sdk = require("sib-api-v3-sdk");

const apiClient = SibApiV3Sdk.ApiClient.instance;

apiClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const transactionalEmailsApi =
  new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({
  to,
  subject,
  htmlContent,
  textContent,
}) => {
  try {
    const email = new SibApiV3Sdk.SendSmtpEmail();

    email.sender = {
      name: process.env.BREVO_SENDER_NAME || "Comfy Sport Wear",
      email: process.env.BREVO_SENDER_EMAIL,
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;
    email.htmlContent = htmlContent;

    if (textContent) {
      email.textContent = textContent;
    }

    const response =
      await transactionalEmailsApi.sendTransacEmail(email);

    console.log(`Email sent successfully to ${to}`);

    return response;
  } catch (error) {
    console.error(
      "Brevo Email Error:",
      error.response?.body || error.message
    );

    throw error;
  }
};

module.exports = {
  sendEmail,
};