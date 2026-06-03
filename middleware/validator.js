const { body, validationResult } = require('express-validator');

const validateBookingPayload = [
    body('planner')
        .notEmpty().withMessage('Planner User reference ID is required')
        .isMongoId().withMessage('Invalid Planner Object ID format'),
    body('venue')
        .notEmpty().withMessage('Venue reference ID is required')
        .isMongoId().withMessage('Invalid Venue Object ID format'),
    body('bookedDate')
        .notEmpty().withMessage('Booking date is required')
        .isISO8601().withMessage('Date must be a valid format (YYYY-MM-DD)'),
    body('totalAmount') 
        .notEmpty().withMessage('Total amount calculation is required')
        .isNumeric().withMessage('Amount field must be a valid number'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array().map(err => ({ field: err.path, error: err.msg }))
            });
        }
        next();
    }
];

module.exports = { validateBookingPayload };