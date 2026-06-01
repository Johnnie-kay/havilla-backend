const nodemailer = require('nodemailer');

// 1. Configure the SMTP transporter environment
// In production/staging, these values will live securely in your .env file
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io', // Defaulting to Mailtrap for testing
    port: process.env.MAIL_PORT || 2525,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

/**
 * Service to handle all background email operations
 */
const NotificationService = {
    
    /**
     * Sends a stylized confirmation receipt to the Event Planner
     */
    async sendBookingConfirmation(plannerEmail, bookingDetails) {
        try {
            const mailOptions = {
                from: '"Havilla Platform Engine" <noreply@havilla.com>',
                to: plannerEmail,
                subject: `🎉 Booking Confirmed: ${bookingDetails.venueName}`,
                html: `
                    <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #4169E1; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Reservation Secured!</h2>
                        <p>Hello,</p>
                        <p>Your request to book <strong>${bookingDetails.venueName}</strong> has been successfully processed and locked into our calendar.</p>
                        
                        <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                            <strong>Event Date:</strong> ${bookingDetails.date}<br>
                            <strong>Transaction ID:</strong> ${bookingDetails.bookingId}<br>
                            <strong>Total Cost:</strong> ₦${bookingDetails.amountPaid}
                        </div>
                        
                        <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                            This is an automated operational transmission from the Havilla Backend Staging Engine.
                        </p>
                    </div>
                `
            };

            // Send email asynchronously in the background
            const info = await transporter.sendMail(mailOptions);
            console.log(`[Notification Service]: Email sent successfully. MessageID: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error(`[Notification Service Error]: Failed to dispatch mail sequence:`, error);
            // We log the error but don't crash the main app execution loop
            return false;
        }
    }
};

module.exports = NotificationService;