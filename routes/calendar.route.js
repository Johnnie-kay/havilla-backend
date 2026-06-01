const express = require('express');
const router = express.Router();
const { verifyDateAvailability } = require('../controllers/calendar.controller');

router.get('/check', verifyDateAvailability);

module.exports = { router };