
const { Booking } = require('../models/schemas');

class CalendarService {
  async checkAvailability(venueId, dateString) {
    const existingBooking = await Booking.findOne({
      venue: venueId,
      bookedDate: dateString,
      status: { $ne: 'cancelled' }
    });
    return existingBooking ? false : true; 
  }
}

module.exports = new CalendarService();