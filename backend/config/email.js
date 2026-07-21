const SibApiV3Sdk = require("sib-api-v3-sdk");

const config = require("./index");

const defaultClient =
  SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications[
  "api-key"
].apiKey = config.brevo.apiKey;

const apiInstance =
  new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({
  to,
  subject,
  htmlContent,
  textContent,
}) => {
  try {
    if (!config.brevo.apiKey) {
      throw new Error(
        "BREVO_API_KEY is missing"
      );
    }

    if (!config.brevo.senderEmail) {
      throw new Error(
        "BREVO_SENDER_EMAIL is missing"
      );
    }

    const sendSmtpEmail =
      new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: config.brevo.senderName,
      email: config.brevo.senderEmail,
    };

    sendSmtpEmail.to = [
      {
        email: to,
      },
    ];

    sendSmtpEmail.subject = subject;

    sendSmtpEmail.htmlContent =
      htmlContent;

    if (textContent) {
      sendSmtpEmail.textContent =
        textContent;
    }

    const response =
      await apiInstance.sendTransacEmail(
        sendSmtpEmail
      );

    console.log(
      `✅ Email sent successfully to ${to}`
    );

    return response;
  } catch (error) {
    console.error(
      "❌ BREVO EMAIL ERROR:",
      error.response?.body ||
        error.response?.data ||
        error.message ||
        error
    );

    throw new Error(
      "Email could not be sent"
    );
  }
};

module.exports = {
  sendEmail,
};