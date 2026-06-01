const CalendarService = require('../services/calendar.service');

const verifyDateAvailability = async (req, res) => {
  try {
    const { venueId, date } = req.query;
    const isAvailable = await CalendarService.checkAvailability(venueId, date);
    res.status(200).json({ success: true, available: isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { verifyDateAvailability };