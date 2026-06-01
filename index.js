const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDatabase();

app.use(cors({
    origin: '*', // Allows all frontend origins to access your API during staging/testing
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const { router: authRouter } = require('./routes/auth.route');
const { router: venueRouter } = require('./routes/venue.route');
const { router: bookingRouter } = require('./routes/booking.route');
const { router: calendarRouter } = require('./routes/calendar.route');

app.use('/api/auth', authRouter);
app.use('/api/venues', venueRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/calendar', calendarRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: "Havilla API core is fully operational and secure." });
});

app.listen(PORT, () => {
  console.log(`Havilla System running on port ${PORT}`);
});

module.exports = app;