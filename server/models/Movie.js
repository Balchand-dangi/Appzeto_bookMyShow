const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be a positive integer'],
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required'],
    },
    cast: {
        type: [String],
        required: [true, 'Cast is required'],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length >= 1,
            message: 'Cast must have at least one member',
        },
    },
    language: {
        type: String,
        required: [true, 'Language is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Movie', movieSchema);
