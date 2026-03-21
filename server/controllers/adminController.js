const Movie = require('../models/Movie');
const Show = require('../models/Show');

// POST /api/admin/movies
const createMovie = async (req, res, next) => {
    try {
        const { title, description, duration, genre, releaseDate, cast, language } = req.body;

        // Validate all required fields
        if (!title || !description || !duration || !genre || !releaseDate || !cast || !language) {
            return res.status(400).json({ message: 'All fields are required: title, description, duration, genre, releaseDate, cast, language' });
        }

        // Validate cast is a non-empty array
        const castArray = Array.isArray(cast) ? cast : typeof cast === 'string' ? cast.split(',').map(s => s.trim()).filter(Boolean) : [];
        if (castArray.length === 0) {
            return res.status(400).json({ message: 'Cast must be a non-empty array with at least one member' });
        }

        // Validate duration is a positive integer
        if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
            return res.status(400).json({ message: 'Duration must be a positive integer (in minutes)' });
        }

        const movie = await Movie.create({
            title: title.trim(),
            description,
            duration: Number(duration),
            genre,
            releaseDate,
            cast: castArray,
            language,
        });

        return res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        next(err);
    }
};

// GET /api/admin/movies
const getMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        return res.status(200).json({ movies });
    } catch (err) {
        next(err);
    }
};

// POST /api/admin/shows
const createShow = async (req, res, next) => {
    try {
        const { movieId, time, totalSeats } = req.body;

        if (!movieId || !time) {
            return res.status(400).json({ message: 'movieId and time are required' });
        }

        // Validate movieId references an existing movie
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: `Movie with id '${movieId}' not found` });
        }

        // Fixed at 30 seats; auto-generate seat objects
        const numSeats = 30;
        const seats = Array.from({ length: numSeats }, (_, i) => ({
            seatNumber: i + 1,
            isBooked: false,
            lockedBy: null,
            lockExpiry: null,
        }));

        const show = await Show.create({
            movieId,
            time,
            totalSeats: numSeats,
            seats,
        });

        return res.status(201).json({ message: 'Show created successfully', show });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid movieId format' });
        }
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        next(err);
    }
};

// GET /api/admin/shows
const getShows = async (req, res, next) => {
    try {
        const { movieId } = req.query;
        const filter = movieId ? { movieId } : {};
        const shows = await Show.find(filter).populate('movieId', 'title genre language duration').sort({ createdAt: -1 });
        return res.status(200).json({ shows });
    } catch (err) {
        next(err);
    }
};

module.exports = { createMovie, getMovies, createShow, getShows };
