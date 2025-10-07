import { LoginPortal } from '@/lib/models/user';
import { sendEmail, EMAIL_CONFIG } from '@/lib/resend';

export interface PasswordResetEmailData {
  to: string;
  firstName: string;
  lastName: string;
  resetUrl: string;
  portal: LoginPortal;
}

export interface PortalInvitationEmailData {
  to: string;
  firstName: string;
  lastName: string;
  loginUrl: string;
  portal: LoginPortal;
  role: string;
  message?: string;
  companyName?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function generatePasswordResetTemplate(data: PasswordResetEmailData): EmailTemplate {
  const { firstName, lastName, resetUrl, portal } = data;
  
  const portalInfo = getPortalInfo(portal);
  
  const subject = `Reset Your ${portalInfo.name} Password - OryxPro`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - OryxPro</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .portal-badge {
          display: inline-block;
          background: ${portalInfo.color};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin: 10px 0;
        }
        .reset-button {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
        }
        .security-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Password Reset Request</h1>
        <div class="portal-badge">${portalInfo.name}</div>
      </div>
      
      <div class="content">
        <h2>Hello ${firstName} ${lastName},</h2>
        
        <p>We received a request to reset your password for the <strong>${portalInfo.name}</strong>.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="reset-button">Reset My Password</a>
        </div>
        
        <div class="security-notice">
          <h3>🔒 Security Notice</h3>
          <ul>
            <li>This link will expire in <strong>1 hour</strong></li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>For security, never share your password with anyone</li>
          </ul>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">
          ${resetUrl}
        </p>
        
        <p>If you have any questions, please contact our support team.</p>
        
        <p>Best regards,<br>The OryxPro Team</p>
      </div>
      
      <div class="footer">
        <p>&copy; 2024 OryxPro. All rights reserved.</p>
        <p>Enterprise Resource Planning System</p>
        <p>Powered by KamSoft - kamsoft.org</p>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Password Reset Request - OryxPro ${portalInfo.name}

Hello ${firstName} ${lastName},

We received a request to reset your password for the ${portalInfo.name}.

To reset your password, click the link below:
${resetUrl}

Security Notice:
- This link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- For security, never share your password with anyone

If you have any questions, please contact our support team.

Best regards,
The OryxPro Team

---
© 2024 OryxPro. All rights reserved.
Enterprise Resource Planning System
Powered by KamSoft - kamsoft.org
  `;
  
  return { subject, html, text };
}

export function generatePortalInvitationTemplate(data: PortalInvitationEmailData): EmailTemplate {
  const { firstName, lastName, loginUrl, portal, role, message, companyName } = data;
  
  const portalInfo = getPortalInfo(portal);
  const displayName = companyName || 'OryxPro';
  
  const subject = `Welcome to ${portalInfo.name} - ${displayName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portal Invitation - ${displayName}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .portal-badge {
          display: inline-block;
          background: ${portalInfo.color};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin: 10px 0;
        }
        .login-button {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
        }
        .welcome-notice {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
        .features-list {
          background: #e7f3ff;
          border: 1px solid #b3d9ff;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .features-list ul {
          margin: 0;
          padding-left: 20px;
        }
        .features-list li {
          margin: 8px 0;
        }
        .role-badge {
          display: inline-block;
          background: #6c757d;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to ${portalInfo.name}</h1>
        <div class="portal-badge">${portalInfo.name}</div>
      </div>
      
      <div class="content">
        <h2>Hello ${firstName} ${lastName},</h2>
        
        <div class="welcome-notice">
          <h3>🎊 Congratulations!</h3>
          <p>You've been invited to join the <strong>${portalInfo.name}</strong> at <strong>${displayName}</strong>.</p>
          <p>Your role: <span class="role-badge">${role}</span></p>
        </div>
        
        ${message ? `
        <div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
          <h4>Personal Message:</h4>
          <p style="white-space: pre-line; margin: 0;">${message}</p>
        </div>
        ` : ''}
        
        <p>Click the button below to access your portal:</p>
        
        <div style="text-align: center;">
          <a href="${loginUrl}" class="login-button">Access ${portalInfo.name}</a>
        </div>
        
        <div class="features-list">
          <h3>🌟 What you can do in ${portalInfo.name}:</h3>
          <ul>
            ${portal === LoginPortal.EMPLOYEE_PORTAL ? `
            <li>View your personal information and payslips</li>
            <li>Submit leave requests and track approvals</li>
            <li>Access company announcements and updates</li>
            <li>Update your contact information and preferences</li>
            <li>View your attendance and performance records</li>
            ` : portal === LoginPortal.CUSTOMER_PORTAL ? `
            <li>View your order history and current status</li>
            <li>Download invoices and receipts</li>
            <li>Track shipments and deliveries</li>
            <li>Update your account information</li>
            <li>Access exclusive offers and promotions</li>
            ` : `
            <li>Complete access to all system modules</li>
            <li>Advanced reporting and analytics</li>
            <li>User and system management</li>
            <li>Full administrative controls</li>
            `}
          </ul>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <h3>🔐 Important Security Information</h3>
          <ul>
            <li><strong>First Login:</strong> You'll be prompted to set a secure password</li>
            <li><strong>Account Security:</strong> Never share your login credentials</li>
            <li><strong>Support:</strong> Contact us if you need assistance</li>
          </ul>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">
          ${loginUrl}
        </p>
        
        <p>We're excited to have you on board! If you have any questions, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>The ${displayName} Team</p>
      </div>
      
      <div class="footer">
        <p>&copy; 2024 ${displayName}. All rights reserved.</p>
        <p>Enterprise Resource Planning System</p>
        <p>Powered by KamSoft - kamsoft.org</p>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Welcome to ${portalInfo.name} - ${displayName}

Hello ${firstName} ${lastName},

Congratulations! You've been invited to join the ${portalInfo.name} at ${displayName}.
Your role: ${role}

${message ? `Personal Message:\n${message}\n` : ''}

To access your portal, click the link below:
${loginUrl}

What you can do in ${portalInfo.name}:
${portal === LoginPortal.EMPLOYEE_PORTAL ? `
- View your personal information and payslips
- Submit leave requests and track approvals
- Access company announcements and updates
- Update your contact information and preferences
- View your attendance and performance records
` : portal === LoginPortal.CUSTOMER_PORTAL ? `
- View your order history and current status
- Download invoices and receipts
- Track shipments and deliveries
- Update your account information
- Access exclusive offers and promotions
` : `
- Complete access to all system modules
- Advanced reporting and analytics
- User and system management
- Full administrative controls
`}

Important Security Information:
- First Login: You'll be prompted to set a secure password
- Account Security: Never share your login credentials
- Support: Contact us if you need assistance

We're excited to have you on board! If you have any questions, please don't hesitate to contact our support team.

Best regards,
The ${displayName} Team

---
© 2024 ${displayName}. All rights reserved.
Enterprise Resource Planning System
Powered by KamSoft - kamsoft.org
  `;
  
  return { subject, html, text };
}

function getPortalInfo(portal: LoginPortal) {
  switch (portal) {
    case LoginPortal.ERP_SYSTEM:
      return {
        name: 'ERP System',
        color: '#007bff'
      };
    case LoginPortal.EMPLOYEE_PORTAL:
      return {
        name: 'Employee Portal',
        color: '#28a745'
      };
    case LoginPortal.CUSTOMER_PORTAL:
      return {
        name: 'Customer Portal',
        color: '#6f42c1'
      };
    default:
      return {
        name: 'System',
        color: '#6c757d'
      };
  }
}

// Send portal invitation email
export async function sendPortalInvitationEmail(data: PortalInvitationEmailData): Promise<boolean> {
  try {
    const template = generatePortalInvitationTemplate(data);
    
    // Send email using Nodemailer with Resend SMTP
    const result = await sendEmail({
      to: data.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: EMAIL_CONFIG.replyTo
    });

    if (!result.success) {
      console.error('Email sending error:', result.error);
      return false;
    }

    console.log('Portal invitation email sent successfully:', {
      to: data.to,
      portal: data.portal,
      role: data.role,
      messageId: result.messageId,
      loginUrl: data.loginUrl
    });

    // In development, also log the email content for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=== PORTAL INVITATION EMAIL SENT ===');
      console.log('Message ID:', result.messageId);
      console.log('To:', data.to);
      console.log('Subject:', template.subject);
      console.log('Portal:', data.portal);
      console.log('Role:', data.role);
      console.log('Login URL:', data.loginUrl);
      console.log('====================================\n');
    }
    
    return true;
    
  } catch (error) {
    console.error('Error sending portal invitation email:', error);
    return false;
  }
}

// Email sending service using Nodemailer with Resend SMTP
export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
  try {
    const template = generatePasswordResetTemplate(data);
    
    // Send email using Nodemailer with Resend SMTP
    const result = await sendEmail({
      to: data.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: EMAIL_CONFIG.replyTo
    });

    if (!result.success) {
      console.error('Email sending error:', result.error);
      return false;
    }

    console.log('Password reset email sent successfully:', {
      to: data.to,
      portal: data.portal,
      messageId: result.messageId,
      resetUrl: data.resetUrl
    });

    // In development, also log the email content for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=== EMAIL SENT VIA RESEND SMTP ===');
      console.log('Message ID:', result.messageId);
      console.log('To:', data.to);
      console.log('Subject:', template.subject);
      console.log('Reset URL:', data.resetUrl);
      console.log('Portal:', data.portal);
      console.log('====================================\n');
    }
    
    return true;
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
