# EmailJS Setup Guide (Alternative to Brevo)

EmailJS is a great alternative that doesn't require IP authorization and works directly from the frontend.

## 🚀 Quick Setup

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month)
3. Verify your email address

### 2. Connect Your Email Service
1. Go to **Email Services** in your dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (easiest for testing)
   - **Outlook**
   - **Yahoo**
   - Or any SMTP service
4. Follow the connection wizard

### 3. Create Email Templates
1. Go to **Email Templates**
2. Click **Create New Template**
3. Create two templates:

**Template 1: Project Approval**
- Template ID: `project_approval`
- Subject: `🎉 Your project "{{project_title}}" has been approved!`
- Content: Use the HTML from our current approval template

**Template 2: Project Rejection**
- Template ID: `project_rejection`
- Subject: `📝 Your project "{{project_title}}" needs updates`
- Content: Use the HTML from our current rejection template

### 4. Get Your Keys
1. Go to **Account** → **General**
2. Copy your **Public Key**
3. Go to **Email Services** and copy your **Service ID**

### 5. Update Environment Variables
```env
# EmailJS Configuration (Alternative to Brevo)
VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
VITE_EMAILJS_APPROVAL_TEMPLATE=project_approval
VITE_EMAILJS_REJECTION_TEMPLATE=project_rejection
```

## 📧 Benefits of EmailJS

- ✅ **No IP restrictions** - works from any location
- ✅ **Frontend-friendly** - designed for client-side use
- ✅ **Multiple email providers** - Gmail, Outlook, SMTP
- ✅ **Template management** - visual template editor
- ✅ **Free tier** - 200 emails/month
- ✅ **Easy setup** - no complex API configuration

## 🔄 Switch to EmailJS

If you want to switch from Brevo to EmailJS, I can update the email service to use EmailJS instead. Just let me know!

## 🎯 Current Status

Right now, the system gracefully handles the Brevo IP authorization issue by falling back to mock mode. You have three options:

1. **Fix Brevo IP issue** - Add your IP to authorized list
2. **Switch to EmailJS** - No IP restrictions
3. **Keep mock mode** - For development/testing

Choose what works best for your needs!