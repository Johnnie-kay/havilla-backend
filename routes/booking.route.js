const express = require('express');
const router = express.Router();

const { validateBookingPayload } = require('../middleware/validator');

const { 
  createNewBooking, 
  getAllBookings, 
  cancelBooking, 
  deleteBooking 
} = require('../controllers/booking.controller');

router.post('/', validateBookingPayload, createNewBooking);

router.get('/', getAllBookings);

router.patch('/:id/cancel', cancelBooking);

router.delete('/:id', deleteBooking);

module.exports = { router };