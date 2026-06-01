const { Booking, Venue } = require('../models/schemas'); 
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

    const savedBooking = await Booking.create(bookingData);

    Venue.findById(bookingData.venue)
      .then(venueDetails => {
        const venueName = venueDetails ? venueDetails.name : "Your Selected Venue";
      
        NotificationService.sendBookingConfirmation(userPayload.email, {
          venueName: venueName,
          date: savedBooking.bookedDate || bookingData.bookedDate,
          bookingId: savedBooking._id,
          amountPaid: savedBooking.totalPrice || bookingData.totalPrice
        });
      })
      .catch(err => console.error("⚠️ Background notification lookup failed:", err));

    return savedBooking;
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

module.exports = new BookingService();