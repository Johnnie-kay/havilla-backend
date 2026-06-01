const express = require('express');
const router = express.Router();
const { getAllVenues, createVenue, deleteVenue } = require('../controllers/venue.controller');

router.get('/', getAllVenues);
router.post('/', createVenue);
router.delete('/:id', deleteVenue);

module.exports = { router };