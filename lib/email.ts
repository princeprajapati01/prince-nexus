import nodemailer from 'nodemailer';

interface EmailPayload {
  to?: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpTo = to || process.env.SMTP_TO || 'pprinceprajapati44@gmail.com';

  // If credentials are not set, log it and return without throwing an error
  if (!smtpUser || !smtpPass) {
    console.warn(
      '⚠️ Email notification skipped: SMTP_USER or SMTP_PASS environment variables are not configured in .env.'
    );
    return { success: false, reason: 'Credentials not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"PRINCE NEXUS Portfolio" <${smtpUser}>`,
      to: smtpTo,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error };
  }
}
