const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: [true, 'Show ID is required'],
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required'],
    },
    userId: {
        type: String,
        required: [true, 'User ID is required'],
    },
    seats: {
        type: [Number],
        required: [true, 'Seats are required'],
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Booking', bookingSchema);
