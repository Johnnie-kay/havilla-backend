const { Resend } = require('resend');

// Initialize Resend directly with the environment API key from your .env
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Service to handle all background email operations using Resend SDK
 */
const NotificationService = {
    
    /**
     * Sends a stylized confirmation receipt to the Event Planner
     */
    async sendBookingConfirmation(plannerEmail, bookingDetails) {
        try {
            // Send email using Resend SDK array format
            const { data, error } = await resend.emails.send({
                // ⚠️ On free plans, this MUST stay as onboarding@resend.dev until you verify a custom domain
                from: 'Havilla Platform Engine <onboarding@resend.dev>',
                to: plannerEmail, // On free accounts, ensure this matches your Resend signup email
                subject: `🎉 Booking Confirmed: ${bookingDetails.venueName}`,
                html: `
                    <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #4169E1; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Reservation Secured!</h2>
                        <p>Hello,</p>
                        <p>Your request to book <strong>${bookingDetails.venueName}</strong> has been successfully processed and locked into our calendar.</p>
                        
                        <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                            <strong>Event Date:</strong> ${bookingDetails.date}<br>
                            <strong>Transaction ID:</strong> ${bookingDetails.bookingId}<br>
                            <strong>Total Cost:</strong> ₦${Number(bookingDetails.amountPaid).toLocaleString()}
                        </div>
                        
                        <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                            This is an automated operational transmission from the Havilla Backend Staging Engine via Resend.
                        </p>
                    </div>
                `
            });

            // Resend captures errors explicitly within its response object instead of throwing them
            if (error) {
                console.error(`[Notification Service Error]: Resend API error:`, error.message);
                return false;
            }

            console.log(`[Notification Service]: Email sent successfully via Resend. MessageID: ${data.id}`);
            return true;
        } catch (error) {
            console.error(`[Notification Service Error]: Failed to dispatch mail sequence:`, error.message);
            // We catch the error here so a delivery fallback never crashes your core Postman endpoints
            return false;
        }
    }
};

module.exports = NotificationService;