const VenueService = require('../services/venue.service');

const getAllVenues = async (req, res) => {
  try {
    const venues = await VenueService.fetchAllVenues();
    res.status(200).json({ success: true, data: venues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVenue = async (req, res) => {
  try {
    const savedVenue = await VenueService.createNewVenue(req.body);
    res.status(201).json({ success: true, data: savedVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    await VenueService.deleteExistingVenue(id);
    res.status(200).json({ success: true, message: "Venue space successfully deleted from Havilla core." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAllVenues, createVenue, deleteVenue };