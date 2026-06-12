const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

connectDatabase();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const authRouter = require('./routes/auth.route');
const venueRouter = require('./routes/venue.route');
const bookingRouter = require('./routes/booking.route');
const calendarRouter = require('./routes/calendar.route');
const userRouter = require('./routes/user.route');
const quoteRouter = require('./routes/quote.route');

app.use('/api/auth', authRouter);
app.use('/api/venues', venueRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/users', userRouter);
app.use('/api/quotes', quoteRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: "Havilla API core is fully operational and secure." });
});

app.listen(PORT, () => {
  console.log(`Havilla System running securely on port ${PORT}`);
});

module.exports = app;
