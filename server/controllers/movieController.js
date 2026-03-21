const Movie = require('../models/Movie');
const Show = require('../models/Show');

// GET /api/movies
const getAllMovies = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        let query = Movie.find().sort({ createdAt: -1 });

        if (page && limit) {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const skip = (pageNum - 1) * limitNum;
            const total = await Movie.countDocuments();
            const movies = await Movie.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum);
            return res.status(200).json({ movies, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
        }

        const movies = await query;
        return res.status(200).json({ movies });
    } catch (err) {
        next(err);
    }
};

// GET /api/movies/:id
const getMovieById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        return res.status(200).json({ movie });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid movie ID format' });
        }
        next(err);
    }
};

// GET /api/shows/:movieId
const getShowsByMovieId = async (req, res, next) => {
    try {
        const { movieId } = req.params;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Clear expired locks lazily before returning shows
        const now = new Date();
        await Show.updateMany(
            { movieId, 'seats.lockExpiry': { $lt: now }, 'seats.isBooked': false },
            {
                $set: {
                    'seats.$[seat].lockedBy': null,
                    'seats.$[seat].lockExpiry': null,
                },
            },
            {
                arrayFilters: [{ 'seat.lockExpiry': { $lt: now }, 'seat.isBooked': false }],
            }
        );

        const shows = await Show.find({ movieId }).sort({ createdAt: 1 });
        return res.status(200).json({ shows });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid movie ID format' });
        }
        next(err);
    }
};

module.exports = { getAllMovies, getMovieById, getShowsByMovieId };
