# Havilla Backend API

Production-grade MVC Service Architecture for the Havilla venue booking platform. Built with Node.js, Express, and MongoDB.

## Overview

Havilla Backend is a RESTful API server that powers the Havilla mobile application. It provides comprehensive endpoints for venue management, booking operations, user authentication, and calendar availability tracking.

## Tech Stack

### Core Framework
- **Node.js**: Runtime environment
- **Express.js**: 5.2.1 - Web application framework
- **Express Validator**: 7.3.2 - Input validation and sanitization

### Database & ORM
- **MongoDB**: NoSQL database
- **Mongoose**: 9.6.3 - MongoDB object modeling

### Authentication & Security
- **Bcrypt**: 6.0.0 - Password hashing and encryption
- **CORS**: 2.8.6 - Cross-Origin Resource Sharing

### Email & Notifications
- **Nodemailer**: 8.0.10 - Email service
- **Resend**: 6.12.4 - Transactional email API

### Environment & Configuration
- **Dotenv**: 17.4.2 - Environment variable management

### Development Tools
- **Nodemon**: 3.1.14 - Auto-restart development server

## Project Structure

```
havilla-backend/
├── config/                       # Configuration files
│   └── db.js                     # Database connection setup
├── controllers/                  # Request handlers (MVC)
│   ├── auth.controller.js        # Authentication logic
│   ├── venue.controller.js       # Venue management logic
│   ├── booking.controller.js     # Booking operations logic
│   └── calendar.controller.js    # Calendar & availability logic
├── routes/                       # API route definitions
│   ├── auth.route.js             # Authentication endpoints
│   ├── venue.route.js            # Venue endpoints
│   ├── booking.route.js          # Booking endpoints
│   └── calendar.route.js         # Calendar endpoints
├── models/                       # Mongoose schemas
│   ├── User.js                   # User schema
│   ├── Venue.js                  # Venue schema
│   ├── Booking.js                # Booking schema
│   └── Calendar.js               # Calendar/availability schema
├── middleware/                   # Express middleware
│   ├── auth.middleware.js        # Authentication middleware
│   ├── validation.middleware.js  # Validation middleware
│   └── errorHandler.middleware.js # Error handling middleware
├── services/                     # Business logic layer
│   ├── auth.service.js           # Auth services
│   ├── venue.service.js          # Venue services
│   ├── booking.service.js        # Booking services
│   ├── email.service.js          # Email services
│   └── calendar.service.js       # Calendar services
├── index.js                      # Main application entry point
├── package.json                  # Dependencies and scripts
├── .gitignore                    # Git ignore configuration
└── README.md                     # This file
```

## Getting Started

### Prerequisites
- Node.js >= 16.x
- npm or yarn
- MongoDB (local or cloud instance via MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Johnnie-kay/havilla-backend.git
   cd havilla-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/havilla
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   
   # Email Configuration (Resend)
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=noreply@havilla.com
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:10000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload (nodemon) |

## API Endpoints

### Base URL
```
http://localhost:10000/api
```

### Health Check
```
GET /health
```
Returns API status.

## Authentication Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token"
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer {token}
```

### Refresh Token
```
POST /api/auth/refresh-token
Authorization: Bearer {token}
```

## Venue Endpoints

### Get All Venues
```
GET /api/venues
```

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `search` - Search query
- `city` - Filter by city
- `capacity` - Minimum capacity

**Response:**
```json
{
  "success": true,
  "venues": [
    {
      "_id": "venue_id",
      "name": "Grand Hall",
      "location": "Lagos, Nigeria",
      "capacity": 500,
      "price": 50000,
      "description": "Spacious venue perfect for events",
      "amenities": ["WiFi", "Parking", "Catering"],
      "images": ["url1", "url2"],
      "rating": 4.5,
      "reviews": 25
    }
  ],
  "pagination": {
    "total": 100,
    "pages": 10,
    "current": 1
  }
}
```

### Get Single Venue
```
GET /api/venues/:venueId
```

### Create Venue (Admin)
```
POST /api/venues
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Grand Hall",
  "location": "Lagos, Nigeria",
  "capacity": 500,
  "price": 50000,
  "description": "Spacious venue",
  "amenities": ["WiFi", "Parking"],
  "images": ["url1", "url2"]
}
```

### Update Venue (Admin)
```
PUT /api/venues/:venueId
Authorization: Bearer {admin_token}
Content-Type: application/json
```

### Delete Venue (Admin)
```
DELETE /api/venues/:venueId
Authorization: Bearer {admin_token}
```

## Booking Endpoints

### Create Booking
```
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "venueId": "venue_id",
  "eventDate": "2024-12-25",
  "eventTime": "18:00",
  "eventType": "Wedding",
  "guestCount": 150,
  "duration": 4,
  "specialRequests": "Need extra parking"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "booking_id",
    "venueId": "venue_id",
    "userId": "user_id",
    "eventDate": "2024-12-25",
    "eventTime": "18:00",
    "status": "pending",
    "totalPrice": 50000,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Bookings
```
GET /api/bookings
Authorization: Bearer {token}
```

Query parameters:
- `status` - Filter by status (pending, confirmed, cancelled)
- `page` - Page number
- `limit` - Results per page

### Get Single Booking
```
GET /api/bookings/:bookingId
Authorization: Bearer {token}
```

### Update Booking
```
PUT /api/bookings/:bookingId
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventDate": "2024-12-26",
  "guestCount": 200
}
```

### Cancel Booking
```
DELETE /api/bookings/:bookingId
Authorization: Bearer {token}
```

## Calendar & Availability Endpoints

### Check Venue Availability
```
GET /api/calendar/availability/:venueId
```

Query parameters:
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "venueId": "venue_id",
  "availability": {
    "2024-12-20": "available",
    "2024-12-21": "available",
    "2024-12-25": "booked",
    "2024-12-26": "available"
  }
}
```

### Get Blocked Dates
```
GET /api/calendar/blocked-dates/:venueId
```

### Block Venue Dates (Admin)
```
POST /api/calendar/block-dates
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "venueId": "venue_id",
  "startDate": "2024-12-20",
  "endDate": "2024-12-22",
  "reason": "Maintenance"
}
```

### Get Calendar View
```
GET /api/calendar/month/:venueId
```

Query parameters:
- `month` - Month (1-12)
- `year` - Year (YYYY)

## Security Features

### Authentication
- JWT-based authentication
- Secure password hashing with Bcrypt
- Token expiration and refresh mechanism

### Authorization
- Role-based access control (RBAC)
- Admin endpoints protected
- User-specific data isolation

### Input Validation
- Express-validator for comprehensive input validation
- Data sanitization
- SQL injection prevention

### CORS
- Cross-Origin Resource Sharing configured
- Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization

## Email Service

### Configuration
Uses **Resend** API for transactional emails.

### Email Templates
- **Welcome Email**: Sent upon user registration
- **Booking Confirmation**: Sent when booking is confirmed
- **Booking Reminder**: Sent 24 hours before event
- **Password Reset**: Sent for password recovery

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  profilePicture: String,
  role: String (user, admin, vendor),
  createdAt: Date,
  updatedAt: Date
}
```

### Venue Model
```javascript
{
  name: String (required),
  owner: ObjectId (User reference),
  location: String,
  city: String,
  capacity: Number,
  pricePerHour: Number,
  description: String,
  amenities: [String],
  images: [String],
  rating: Number,
  reviews: [ObjectId],
  availability: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (User reference),
  venue: ObjectId (Venue reference),
  eventDate: Date,
  eventTime: String,
  eventType: String,
  guestCount: Number,
  duration: Number,
  totalPrice: Number,
  status: String (pending, confirmed, cancelled),
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

```bash
# Run tests (add test script to package.json when implementing)
npm test
```

## Deployment

### Prerequisites for Production
- MongoDB Atlas account (or self-hosted MongoDB)
- Resend API key for email service
- Environment variables configured

### Deployment Options

**Heroku:**
```bash
git push heroku main
```

**Railway, Render, or similar:**
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

**Docker:**
```bash
docker build -t havilla-backend .
docker run -p 10000:10000 --env-file .env havilla-backend
```

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code",
  "details": {}
}
```

## Status Codes

- `200` - OK / Successful request
- `201` - Created / Resource created
- `400` - Bad Request / Invalid input
- `401` - Unauthorized / Invalid credentials
- `403` - Forbidden / Insufficient permissions
- `404` - Not Found / Resource not found
- `409` - Conflict / Resource already exists
- `500` - Internal Server Error

## Middleware

### Authentication Middleware
- Verifies JWT tokens
- Attaches user data to request object
- Handles token expiration

### Validation Middleware
- Validates request body
- Validates query parameters
- Returns validation errors

### Error Handler Middleware
- Catches and processes errors
- Returns consistent error responses
- Logs errors for debugging

## API Documentation

For detailed API documentation, refer to the Postman collection or OpenAPI/Swagger specification (if available).

## Contributing

1. Create a feature branch
   ```bash
   git checkout -b feature/feature-name
   ```

2. Make your changes and commit
   ```bash
   git commit -m "Add your feature description"
   ```

3. Push to your fork
   ```bash
   git push origin feature/feature-name
   ```

4. Open a Pull Request

## Support & Contact

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact the development team

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/)
- [Resend Email Service](https://resend.com/)

## License

This project is under ISC License.

---

**Last Updated**: June 5, 2026
**Version**: 1.0.0
**Status**: Active Development
**Architecture**: Production-grade MVC Service Architecture
