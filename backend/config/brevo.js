const brevo = require("@getbrevo/brevo");
const config = require("./index");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  config.brevo.apiKey
);

const sendEmail = async ({ to, subject, htmlContent, textContent }) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: config.brevo.senderName,
      email: config.brevo.senderEmail,
    };

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    if (textContent) {
      sendSmtpEmail.textContent = textContent;
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error("Brevo email error:", error.message);
    throw error;
  }
};

const notifyAdmin = async ({ subject, htmlContent }) => {
  if (!config.adminEmail) return;

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: config.brevo.senderName,
      email: config.brevo.senderEmail,
    };

    sendSmtpEmail.to = [{ email: config.adminEmail }];
    sendSmtpEmail.subject = `[Admin] ${subject}`;
    sendSmtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Admin notification error:", error.message);
  }
};

module.exports = { sendEmail, notifyAdmin };