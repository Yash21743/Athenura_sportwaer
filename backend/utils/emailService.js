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

module.exports = {
  sendEmail,
};