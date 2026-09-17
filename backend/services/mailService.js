const nodemailer = require('nodemailer');

/**
 * Creates and returns a configured Nodemailer transporter.
 * Supports Gmail directly via service: 'gmail' or custom SMTP via host/port.
 */
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (!emailUser || !emailPass) {
    throw new Error(
      'Email credentials missing. Please set EMAIL_USER and EMAIL_APP_PASSWORD in backend/.env'
    );
  }

  // If a custom SMTP host is specified, use host/port
  if (smtpHost && smtpHost.trim().length > 0) {
    return nodemailer.createTransport({
      host: smtpHost.trim(),
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: emailUser.trim(),
        pass: emailPass.trim(),
      },
    });
  }

  // Otherwise, default to Gmail service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser.trim(),
      pass: emailPass.trim(),
    },
  });
}

/**
 * Sends a password reset email to the candidate.
 *
 * @param {string} toEmail - Recipient email address
 * @param {string} resetUrl - Complete password reset link with token
 * @returns {Promise<{ sent: boolean, messageId: string }>}
 */
async function sendPasswordResetEmail(toEmail, resetUrl) {
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const mailFrom =
    process.env.MAIL_FROM ||
    (emailUser ? `"SmartInterview AI" <${emailUser.trim()}>` : '"SmartInterview AI" <no-reply@smartinterview.ai>');

  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .logo { font-size: 20px; font-weight: 700; color: #4f46e5; margin-bottom: 24px; display: inline-block; }
          h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
          p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px; }
          .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 10px 0 24px; }
          .url-box { font-size: 12px; color: #64748b; word-break: break-all; background: #f1f5f9; padding: 12px; border-radius: 8px; }
          .footer { margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">SmartInterview AI</div>
          <h1>Password Reset Request</h1>
          <p>You recently requested to reset your password for your SmartInterview AI account. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="btn" target="_blank" style="color:#ffffff;">Reset Password</a>
          <p>This password reset link is valid for <strong>30 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
          <p>If the button above does not work, copy and paste this link into your browser:</p>
          <div class="url-box">${resetUrl}</div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} SmartInterview AI Platform. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  const text =
    `You recently requested to reset your password for your SmartInterview AI account.\n\n` +
    `Click the following link to reset your password:\n${resetUrl}\n\n` +
    `This link expires in 30 minutes. If you did not request this, you can safely ignore this email.`;

  const info = await transporter.sendMail({
    from: mailFrom,
    to: toEmail,
    subject: 'Reset your SmartInterview AI password',
    text,
    html,
  });

  return { sent: true, messageId: info.messageId };
}

module.exports = {
  sendPasswordResetEmail,
};
