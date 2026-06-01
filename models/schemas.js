
const mongoose = require('mongoose');

// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['planner', 'owner', 'admin'], default: 'planner' }
}, 
{ timestamps: true });

// 2. Venue Schema
const VenueSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  state: { type: String, default: 'Lagos' },
  city: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true }
}, 
{ timestamps: true });

// 3. Booking Schema
const BookingSchema = new mongoose.Schema({
  planner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  bookedDate: { type: String, required: true }, 
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, 
{ timestamps: true });


module.exports = {
  User: mongoose.model('User', UserSchema),
  Venue: mongoose.model('Venue', VenueSchema),
  Booking: mongoose.model('Booking', BookingSchema)
};