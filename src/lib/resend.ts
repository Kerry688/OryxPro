import nodemailer from 'nodemailer';

// Email configuration
export const EMAIL_CONFIG = {
  from: 'OryxPro <noreply@kamsoft.org>',
  replyTo: 'support@kamsoft.org',
  companyName: 'OryxPro',
  companyUrl: 'https://kamsoft.org',
  // Resend SMTP configuration
  smtp: {
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY || 're_7q5qpSqt_8dWKpi5xMHo1HSkNrddrqnAw'
    }
  }
};

// Create nodemailer transporter for Resend
const transporter = nodemailer.createTransport(EMAIL_CONFIG.smtp);

export default transporter;

// Verify email connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email connection error:', error);
    return false;
  }
}

// Send email using nodemailer
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const result = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || EMAIL_CONFIG.replyTo
    });

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
