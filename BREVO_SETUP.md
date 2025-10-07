# Brevo (Sendinblue) Email Setup Guide

This guide will help you set up Brevo email service to send real emails when projects are approved or rejected.

## 🚀 Quick Setup

### 1. Create a Brevo Account
1. Go to [Brevo.com](https://www.brevo.com/) (formerly Sendinblue)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Log in to your Brevo dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate a new API key**
4. Give it a name like "NaedeX Project Notifications"
5. Copy the generated API key

### 3. Configure Your Domain (Optional but Recommended)
1. Go to **Settings** → **Senders & IP**
2. Add your domain (e.g., `naedex.com`)
3. Verify domain ownership by adding DNS records
4. This allows you to send emails from `noreply@naedex.com`

### 4. Authorize Your IP Address (Important!)
1. Go to **Settings** → **Security** → **Authorized IPs**
2. Click **Add IP Address**
3. Add your current IP address: `103.87.26.94` (or get your current IP from [whatismyipaddress.com](https://whatismyipaddress.com/))
4. Give it a name like "Development Server"
5. Click **Save**

**Note**: If you're using a dynamic IP or deploying to different servers, you may need to add multiple IPs or disable IP restrictions.

### 5. Update Environment Variables
Open your `.env` file and update these values:

```env
# Brevo (Sendinblue) API Configuration
VITE_BREVO_API_KEY=your-actual-brevo-api-key-here
VITE_FROM_EMAIL=noreply@yourdomain.com
VITE_FROM_NAME=NaedeX Team
```

**Replace:**
- `your-actual-brevo-api-key-here` with your real API key from step 2
- `noreply@yourdomain.com` with your verified sender email
- `NaedeX Team` with your preferred sender name

### 6. Test the Setup
1. Submit a test project
2. Go to admin dashboard (`/admin`)
3. Approve or reject the project
4. Check the browser console for success messages
5. Check the recipient's email inbox

## 📧 Email Templates

The system sends two types of emails:

### Project Approval Email
- **Subject**: `🎉 Your project "[Title]" has been approved!`
- **Content**: Congratulations message with project showcase link
- **Styling**: Green success theme

### Project Rejection Email
- **Subject**: `📝 Your project "[Title]" needs updates`
- **Content**: Constructive feedback with resubmission guidance
- **Styling**: Orange/yellow informational theme

## 🔧 Features

- ✅ **Beautiful HTML emails** with responsive design
- ✅ **Fallback text versions** for email clients that don't support HTML
- ✅ **Professional styling** with gradients and call-to-action buttons
- ✅ **Mock mode** when API key is not configured (for development)
- ✅ **Error handling** with detailed logging
- ✅ **CORS-friendly** API calls from frontend

## 🎯 Brevo Free Plan Limits

- **300 emails per day** (perfect for project notifications)
- **Unlimited contacts**
- **Email templates**
- **API access**

## 🛠️ Troubleshooting

### "Mock mode" messages in console
- Your API key is not configured or set to the placeholder value
- Update `VITE_BREVO_API_KEY` in your `.env` file

### "IP Address not authorized" error (401 Unauthorized)
- **Most common issue!** Brevo blocks unrecognized IP addresses
- Go to [Brevo Security Settings](https://app.brevo.com/security/authorised_ips)
- Add your current IP address: `103.87.26.94`
- Or disable IP restrictions if you have a dynamic IP
- The system will automatically fall back to mock mode if IP is blocked

### "Failed to send email" errors
- Check your API key is correct
- Verify your sender email is authorized in Brevo
- Check browser network tab for detailed error messages

### Emails not being received
- Check spam/junk folders
- Verify recipient email address is correct
- Check Brevo dashboard for delivery status

## 🔒 Security Notes

- Never commit your real API key to version control
- Keep your `.env` file in `.gitignore`
- Use environment variables for all sensitive configuration
- Consider using different API keys for development and production

## 📊 Monitoring

You can monitor email delivery in your Brevo dashboard:
1. Go to **Statistics** → **Email**
2. View delivery rates, opens, clicks
3. Check for bounced or blocked emails

## 🎉 You're All Set!

Once configured, your users will receive beautiful, professional emails when their projects are approved or rejected. The system automatically handles both HTML and text versions for maximum compatibility.