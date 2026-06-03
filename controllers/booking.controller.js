const { User } = require('../models/schemas'); // 👈 Added User model lookup for emails
const BookingService = require('../services/booking.service');

// 1. CREATE A NEW BOOKING (WITH EMAIL LOOKUP)
const createNewBooking = async (req, res) => {
  try {
    const { planner } = req.body;

    // Guard Clause: Make sure a planner ID was actually provided
    if (!planner) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: A planner (User ID) must be specified to create a booking."
      });
    }

    // Fetch the planner's user profile from the database to extract their real email address
    const userPayload = await User.findById(planner);
    if (!userPayload) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking failed: The planner (User ID) provided does not exist in the database." 
      });
    }

    // FIX: Pass BOTH req.body data and the fetched user profile into the service layer
    const booking = await BookingService.createNewBooking(req.body, userPayload);
    
    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 2. GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingService.fetchAllBookings();
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. CONFIRM A BOOKING (AUTH-CONSCIOUS APPROACH)
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body; // Expecting the mobile/frontend app to pass who is confirming this

    // Security Gate: Ensure an ID was passed in the request body
    if (!adminId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: An Admin/Owner ID must be provided to confirm bookings." 
      });
    }

    // Pass both the booking ID and the admin's ID down to your service layer
    const updatedBooking = await BookingService.confirmBookingSession(id, adminId);
    
    return res.status(200).json({ 
      success: true, 
      message: "Booking status successfully updated to confirmed.", 
      data: updatedBooking 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 4. CANCEL A BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await BookingService.cancelBookingSession(id);
    return res.status(200).json({ success: true, message: "Booking cancelled successfully.", data: updatedBooking });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 5. DELETE A BOOKING
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingService.removeBookingPermanently(id);
    return res.status(200).json({ success: true, message: "Booking record completely removed from database." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Export all 5 methods out cleanly to your router file
module.exports = { 
  createNewBooking, 
  getAllBookings, 
  confirmBooking, 
  cancelBooking, 
  deleteBooking 
};