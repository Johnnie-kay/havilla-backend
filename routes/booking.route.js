const express = require('express');
const router = express.Router();

const { validateBookingPayload } = require('../middleware/validator');

const { 
  createNewBooking, 
  getAllBookings, 
  cancelBooking,
  confirmBooking, 
  deleteBooking 
} = require('../controllers/booking.controller');

router.post('/', validateBookingPayload, createNewBooking);

router.get('/', getAllBookings);

router.patch('/:id/cancel', cancelBooking);

router.patch('/:id/confirm', confirmBooking); 

router.delete('/:id', deleteBooking);

module.exports = { router };