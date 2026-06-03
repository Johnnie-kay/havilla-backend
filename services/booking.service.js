const { Booking, Venue, User } = require('../models/schemas'); 
const NotificationService = require('./notification.service'); 

class BookingService {
  
  async fetchAllBookings() {
    return await Booking.find().populate('planner venue');
  }

  async createBooking(bookingData) {
    const booking = new Booking(bookingData);
    return await booking.save();
  }

  async createNewBooking(bookingData, userPayload) {
    // 1. Commit the booking information directly to MongoDB
    const savedBooking = await Booking.create(bookingData);

    // Safeguard: Make sure userPayload and email exist before running background operations
    if (userPayload && userPayload.email) {
      Venue.findById(bookingData.venue)
        .then(venueDetails => {
          const venueName = venueDetails ? venueDetails.name : "Your Selected Venue";
        
          // 2. Fire and forget the Resend notification delivery routine in the background
          NotificationService.sendBookingConfirmation(userPayload.email, {
            venueName: venueName,
            date: savedBooking.bookedDate || bookingData.bookedDate,
            bookingId: savedBooking._id,
            amountPaid: savedBooking.totalAmount || bookingData.totalAmount || 0 // 👈 FIXED: Changed from totalPrice to match your Postman schema
          });
        })
        .catch(err => console.error("⚠️ Background notification lookup failed:", err));
    } else {
      console.warn("⚠️ Email skipped: No valid userPayload or email property provided.");
    }

    return savedBooking;
  }

  // CONFIRM BOOKING SESSION WITH ROLE VALIDATION
  async confirmBookingSession(bookingId, adminId) {
    // 1. Fetch the user attempting the confirmation to verify identity
    const staffUser = await User.findById(adminId);
    if (!staffUser) {
      throw new Error("Authorization Failed: Admin/Owner profile does not exist.");
    }

    // 2. Enforce structural check: Reject normal accounts
    if (staffUser.role !== 'admin' && staffUser.role !== 'owner') {
      throw new Error("Forbidden Access: Only designated administrators or owners can confirm booking records.");
    }

    // 3. Look up the booking record
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking record not found.");
    }

    if (booking.status === 'confirmed') {
      throw new Error("This booking has already been confirmed.");
    }

    // 4. Update status and commit changes cleanly to MongoDB
    booking.status = 'confirmed';
    await booking.save();

    return booking;
  }

  async cancelBookingSession(bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking record not found.");
    }

    if (booking.status === 'cancelled') {
      throw new Error("This booking has already been cancelled.");
    }

    booking.status = 'cancelled';
    await booking.save();

    return booking;
  }

  async removeBookingPermanently(bookingId) {
    const droppedRecord = await Booking.findByIdAndDelete(bookingId);
    if (!droppedRecord) {
      throw new Error("Booking document does not exist.");
    }
    return droppedRecord;
  }
}

// Exporting an instantiated instance to preserve your existing dependency patterns
module.exports = new BookingService();