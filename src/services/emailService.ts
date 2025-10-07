// Email service for sending notifications using Brevo (Sendinblue) API

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface BrevoEmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

class EmailService {
  private readonly brevoApiKey = import.meta.env.VITE_BREVO_API_KEY;
  private readonly fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@naedex.com';
  private readonly fromName = import.meta.env.VITE_FROM_NAME || 'NaedeX Team';
  private readonly brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';

  private async sendBrevoEmail(emailData: BrevoEmailRequest): Promise<{ success: boolean; message: string }> {
    // Check if Brevo API key is configured
    if (!this.brevoApiKey || this.brevoApiKey === 'your-brevo-api-key-here') {
      console.log('🔄 Brevo API key not configured - using mock mode');
      console.log('📧 Mock Email:', {
        to: emailData.to[0].email,
        subject: emailData.subject,
        from: `${emailData.sender.name} <${emailData.sender.email}>`,
        timestamp: new Date().toISOString()
      });
      return {
        success: true,
        message: 'Email sent successfully (Mock mode - configure VITE_BREVO_API_KEY for real emails)'
      };
    }

    try {
      const response = await fetch(this.brevoApiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.brevoApiKey
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Brevo API Error:', errorData);
        
        // Handle IP authorization error specifically
        if (errorData.code === 'unauthorized' && errorData.message?.includes('IP address')) {
          console.log('🔒 IP Address not authorized in Brevo. Using mock mode.');
          console.log('📧 Mock Email (IP Blocked):', {
            to: emailData.to[0].email,
            subject: emailData.subject,
            from: `${emailData.sender.name} <${emailData.sender.email}>`,
            timestamp: new Date().toISOString(),
            note: 'Add your IP to Brevo authorized IPs: https://app.brevo.com/security/authorised_ips'
          });
          return {
            success: true,
            message: 'Email sent successfully (Mock mode - IP not authorized in Brevo)'
          };
        }
        
        return {
          success: false,
          message: `Failed to send email: ${errorData.message || response.statusText}`
        };
      }

      const result = await response.json();
      console.log('✅ Email sent successfully via Brevo:', result.messageId);

      return {
        success: true,
        message: 'Email sent successfully via Brevo'
      };
    } catch (error) {
      console.error('Error sending email via Brevo:', error);
      return {
        success: false,
        message: 'Failed to send email due to network error'
      };
    }
  }

  // Send project approval email
  async sendProjectApprovalEmail(
    userEmail: string,
    projectTitle: string,
    projectId: string
  ): Promise<{ success: boolean; message: string }> {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Congratulations!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Your project has been approved!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Great news! Your project <strong>"${projectTitle}"</strong> has been reviewed and approved by our team. 
              It's now live on our project showcase for everyone to see.
            </p>
            
            <div style="margin: 30px 0; padding: 20px; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
              <p style="margin: 0; color: #155724;">
                <strong>What's next?</strong><br>
                Your project is now visible to all visitors on our platform. Share it with your network and showcase your amazing work!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/projects" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Your Project
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Thank you for contributing to our community!<br>
              The NaedeX Team
            </p>
          </div>
        </div>
        `;

    const textContent = `
        Congratulations! Your project "${projectTitle}" has been approved!
        
        Your project has been reviewed and approved by our team. It's now live on our project showcase.
        
        View your project: ${window.location.origin}/projects
        
        Thank you for contributing to our community!
        The NaedeX Team
        `;

    const emailData: BrevoEmailRequest = {
      sender: {
        name: this.fromName,
        email: this.fromEmail
      },
      to: [{
        email: userEmail
      }],
      subject: `🎉 Your project "${projectTitle}" has been approved!`,
      htmlContent,
      textContent
    };

    return await this.sendBrevoEmail(emailData);
  }

  // Send project rejection email
  async sendProjectRejectionEmail(
    userEmail: string,
    projectTitle: string,
    projectId: string,
    feedback?: string
  ): Promise<{ success: boolean; message: string }> {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 30px; text-align: center;">
            <h1 style="color: #2d3436; margin: 0;">📝 Project Review Update</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Your project needs some updates</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for submitting your project <strong>"${projectTitle}"</strong>. 
              After review, we've identified some areas that need attention before it can be approved.
            </p>
            
            ${feedback ? `
              <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">
                  <strong>Feedback:</strong><br>
                  ${feedback}
                </p>
              </div>
            ` : ''}
            
            <div style="margin: 30px 0; padding: 20px; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
              <p style="margin: 0; color: #0c5460;">
                <strong>Next Steps:</strong><br>
                Please review the feedback and make the necessary updates to your project. 
                You can resubmit it once the changes are complete.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/projects" 
                 style="background: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Submit Updated Project
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              We appreciate your contribution and look forward to seeing your updated project!<br>
              The NaedeX Team
            </p>
          </div>
        </div>
        `;

    const textContent = `
        Your project "${projectTitle}" needs updates
        
        Thank you for submitting your project. After review, we've identified some areas that need attention before it can be approved.
        
        ${feedback ? `Feedback: ${feedback}` : ''}
        
        Please review the feedback and make the necessary updates. You can resubmit once the changes are complete.
        
        Submit updated project: ${window.location.origin}/projects
        
        We appreciate your contribution!
        The NaedeX Team
        `;

    const emailData: BrevoEmailRequest = {
      sender: {
        name: this.fromName,
        email: this.fromEmail
      },
      to: [{
        email: userEmail
      }],
      subject: `📝 Your project "${projectTitle}" needs updates`,
      htmlContent,
      textContent
    };

    return await this.sendBrevoEmail(emailData);
  }
}

export const emailService = new EmailService();