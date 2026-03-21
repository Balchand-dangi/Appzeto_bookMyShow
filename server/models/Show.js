const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    lockedBy: { type: String, default: null },
    lockExpiry: { type: Date, default: null },
});

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required'],
    },
    time: {
        type: String,
        required: [true, 'Show time is required'],
    },
    totalSeats: {
        type: Number,
        default: 30,
    },
    seats: [seatSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Show', showSchema);
