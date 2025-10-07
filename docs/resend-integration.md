# Resend SMTP Email Integration

## Overview
The OryxPro application now uses Resend SMTP via Nodemailer for sending password reset emails. This provides reliable email delivery with professional templates without complex dependencies.

## Configuration

### Environment Variables
Create a `.env.local` file in your project root with the following variables:

```bash
# Resend API Configuration
RESEND_API_KEY=re_7q5qpSqt_8dWKpi5xMHo1HSkNrddrqnAw

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/oryxpro
```

### API Key Setup
The Resend API key is already configured in the code for testing purposes:
- **API Key**: `re_7q5qpSqt_8dWKpi5xMHo1HSkNrddrqnAw`
- **SMTP Host**: `smtp.resend.com`
- **Port**: `587` (TLS)
- **Fallback**: The code will use the environment variable if available, otherwise use the hardcoded key

### Dependencies
- **Nodemailer**: For SMTP email sending
- **No React Email**: Simplified approach without complex dependencies

## Features

### Email Templates
- **Portal-Specific Branding**: Different colors and styling for each portal
- **HTML & Text Versions**: Both formats supported for maximum compatibility
- **Responsive Design**: Templates work on all email clients
- **Security Information**: Clear expiration notices and security warnings

### Portal Styling
- **ERP System**: Blue theme with building icon
- **Employee Portal**: Green theme with users icon  
- **Customer Portal**: Purple theme with user-check icon

### Security Features
- **Token Expiration**: Reset links expire after 1 hour
- **One-time Use**: Tokens are invalidated after successful use
- **Secure Generation**: Cryptographically secure token generation
- **Email Enumeration Protection**: Doesn't reveal if email exists

## Testing

### Test Page
Visit `/test-forgot-password` to test the email functionality:

1. **Test Resend Connection**: Verify API connectivity
2. **Send Test Emails**: Send test emails to any address
3. **Test Reset Flow**: Complete password reset process
4. **Monitor Logs**: Check console for delivery status

### Demo Users
Use these test accounts:
- **Admin**: `admin@oryxpro.com` (ERP System)
- **John Employee**: `john.employee@oryxpro.com` (Employee Portal)
- **Ahmed Customer**: `ahmed.customer@techsolutions.com` (Customer Portal)

## API Endpoints

### Forgot Password
```
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

### Verify Reset Token
```
GET /api/auth/verify-reset-token?token=<reset-token>
```

### Reset Password
```
POST /api/auth/reset-password
{
  "token": "<reset-token>",
  "password": "new-password"
}
```

### Test Email
```
GET /api/auth/test-resend          # Test connection
POST /api/auth/test-resend         # Send test email
{
  "email": "test@example.com",
  "portal": "erp_system"
}

# Simple test endpoint
GET /api/auth/test-email-simple    # Test connection
POST /api/auth/test-email-simple   # Send simple test email
{
  "email": "test@example.com"
}
```

## Email Template Structure

### HTML Template Features
- Professional header with gradient background
- Portal-specific badge and branding
- Clear call-to-action button
- Security notice section
- Responsive design for mobile devices
- Footer with company information

### Text Template Features
- Clean, readable plain text format
- Same information as HTML version
- Compatible with all email clients
- Proper formatting and spacing

## Monitoring & Logging

### Console Logs
In development mode, the system logs:
- Email sending status
- Resend API responses
- Delivery confirmations
- Error messages

### Production Monitoring
For production deployment:
1. Set up proper environment variables
2. Monitor Resend dashboard for delivery stats
3. Set up error alerting for failed sends
4. Track email open and click rates

## Customization

### Email Branding
To customize email templates:
1. Edit `src/lib/email-service.ts`
2. Modify the `generatePasswordResetTemplate` function
3. Update colors, fonts, and styling as needed
4. Test with different portals

### Domain Configuration
To use your own domain:
1. Update `EMAIL_CONFIG.from` in `src/lib/resend.ts`
2. Verify domain with Resend
3. Update reply-to address
4. Test email delivery

## Troubleshooting

### Common Issues
1. **API Key Invalid**: Verify the Resend API key is correct
2. **Domain Not Verified**: Ensure your sending domain is verified in Resend
3. **Rate Limits**: Check Resend dashboard for rate limit status
4. **Email Blocked**: Check spam folders and email client settings

### Debug Steps
1. Test Resend connection via `/test-forgot-password`
2. Check browser console for error messages
3. Verify environment variables are set
4. Test with a simple email address first

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure proper `RESEND_API_KEY`
3. Set `NEXT_PUBLIC_BASE_URL` to your domain
4. Verify email templates render correctly

### Security Considerations
1. Never commit API keys to version control
2. Use environment variables for all sensitive data
3. Enable rate limiting on API endpoints
4. Monitor for unusual email sending patterns

## Support

For issues with Resend integration:
1. Check Resend dashboard for delivery status
2. Review console logs for error messages
3. Test with the provided test endpoints
4. Verify email template rendering in different clients
