const { body, validationResult } = require('express-validator');

const validateBookingPayload = [
    body('venue')
        .notEmpty().withMessage('Venue reference ID is required')
        .isMongoId().withMessage('Invalid MongoDB Object ID format'),
    body('bookedDate')
        .notEmpty().withMessage('Booking execution date is required')
        .isISO8601().withMessage('Date must be a valid format (YYYY-MM-DD)'),
    body('totalPrice')
        .notEmpty().withMessage('Total transaction price is required')
        .isNumeric().withMessage('Price field must be a valid numeric calculation'),
    
    // Custom interceptor middleware to return clean JSON error logs
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: "Payload validation failure.",
                errors: errors.array().map(err => ({ field: err.path, error: err.msg }))
            });
        }
        next();
    }
];

module.exports = { validateBookingPayload };