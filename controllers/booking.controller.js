// controllers/booking.controller.js

// Import the booking service layer to communicate with MongoDB
const BookingService = require('../services/booking.service');

/**
 * POST /api/bookings
 * Creates a brand-new booking session for a planner
 */
const createNewBooking = async (req, res) => {
  try {
    // Send the incoming body data straight to the service layer
    const booking = await BookingService.createNewBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/bookings
 * Fetches all registered booking documents with populated relations
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingService.fetchAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/bookings/:id/cancel
 * Toggles a booking status to cancelled and opens up the venue dates
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await BookingService.cancelBookingSession(id);
    res.status(200).json({ success: true, message: "Booking cancelled successfully.", data: updatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/bookings/:id
 * Permanently deletes a booking record from the cluster database
 */
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingService.removeBookingPermanently(id);
    res.status(200).json({ success: true, message: "Booking record completely removed from database." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 💡 EXPORT PACKAGING: This binds the functions so "Full Controller Object" won't be empty!
module.exports = { 
  createNewBooking, 
  getAllBookings, 
  cancelBooking, 
  deleteBooking 
};