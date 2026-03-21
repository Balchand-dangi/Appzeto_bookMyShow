const Show = require('../models/Show');
const Booking = require('../models/Booking');
const { getSeatPrice } = require('./seatController');

// Helper: clear expired locks from a show document
const clearExpiredLocks = async (showId) => {
    const now = new Date();
    await Show.updateOne(
        { _id: showId },
        {
            $set: {
                'seats.$[seat].lockedBy': null,
                'seats.$[seat].lockExpiry': null,
            },
        },
        {
            arrayFilters: [
                { 'seat.lockExpiry': { $lt: now }, 'seat.isBooked': false },
            ],
        }
    );
};

// POST /api/book
const createBooking = async (req, res, next) => {
    try {
        const { showId, seats } = req.body;
        const userId = req.user.id; // Taken from JWT — cannot be spoofed

        // Validation: seats non-empty
        if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: 'seats must be a non-empty array' });
        }

        // Validation: seat numbers in valid range
        const invalidSeats = seats.filter(s => s < 1 || s > 30 || !Number.isInteger(s));
        if (invalidSeats.length > 0) {
            return res.status(400).json({ message: `Seat numbers must be between 1 and 30. Invalid: ${invalidSeats.join(', ')}` });
        }

        // Lazy expiry clear
        await clearExpiredLocks(showId);

        // Fetch show
        const show = await Show.findById(showId).populate('movieId');
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        const now = new Date();
        const bookedConflicts = [];
        const lockedConflicts = [];

        for (const seatNum of seats) {
            const seat = show.seats.find(s => s.seatNumber === seatNum);
            if (!seat) {
                return res.status(400).json({ message: `Seat ${seatNum} does not exist in this show` });
            }
            if (seat.isBooked) {
                bookedConflicts.push(seatNum);
            } else if (seat.lockedBy && seat.lockedBy.toString() !== userId.toString() && seat.lockExpiry > now) {
                lockedConflicts.push(seatNum);
            }
        }

        if (bookedConflicts.length > 0) {
            return res.status(409).json({
                message: `Seats already booked: ${bookedConflicts.join(', ')}`,
                bookedConflicts,
            });
        }

        if (lockedConflicts.length > 0) {
            return res.status(409).json({
                message: `Seats temporarily held by another user: ${lockedConflicts.join(', ')}`,
                lockedConflicts,
            });
        }

        // Check that all requested seats are either locked by this user or still available
        // Seats locked by this user can be booked; seats with expired locks or no lock can also be booked
        for (const seatNum of seats) {
            const seat = show.seats.find(s => s.seatNumber === seatNum);
            // If locked by someone else (already handled above), or if lock expired — allow booking
            // If seat was locked by this user — valid. If not locked at all — also valid.
        }

        // Calculate total price (backend only)
        let totalPrice = 0;
        const priceBreakdown = seats.map(seatNum => {
            const price = getSeatPrice(seatNum);
            totalPrice += price;
            const row = seatNum <= 10 ? 'A (Standard)' : seatNum <= 20 ? 'B (Premium)' : 'C (VIP)';
            return { seatNumber: seatNum, row, price };
        });

        // Mark seats as booked and clear locks
        for (const seatNum of seats) {
            const seat = show.seats.find(s => s.seatNumber === seatNum);
            if (seat) {
                seat.isBooked = true;
                seat.lockedBy = null;
                seat.lockExpiry = null;
            }
        }

        await show.save();

        // Create booking record
        const booking = await Booking.create({
            showId,
            movieId: show.movieId._id || show.movieId,
            userId,
            seats,
            totalPrice,
        });

        return res.status(201).json({
            message: 'Booking confirmed successfully',
            booking: {
                ...booking.toObject(),
                priceBreakdown,
                movieTitle: show.movieId.title || 'N/A',
                showTime: show.time,
            },
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid showId format' });
        }
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        next(err);
    }
};

// GET /api/bookings/:userId
const getUserBookings = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { page, limit } = req.query;

        // Security: non-admin users can only view their own bookings
        if (req.user.role !== 'admin' && req.user.id.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied. You can only view your own bookings.' });
        }

        let query = Booking.find({ userId })
            .populate({ path: 'showId', select: 'time totalSeats movieId', populate: { path: 'movieId', select: 'title genre language duration' } })
            .populate('movieId', 'title genre language duration')
            .sort({ bookedAt: -1 });

        if (page && limit) {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const skip = (pageNum - 1) * limitNum;
            const total = await Booking.countDocuments({ userId });
            const bookings = await Booking.find({ userId })
                .populate({ path: 'showId', select: 'time totalSeats movieId', populate: { path: 'movieId', select: 'title genre language duration' } })
                .populate('movieId', 'title genre language duration')
                .sort({ bookedAt: -1 })
                .skip(skip)
                .limit(limitNum);
            return res.status(200).json({ bookings, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
        }

        const bookings = await query;
        return res.status(200).json({ bookings });
    } catch (err) {
        next(err);
    }
};

module.exports = { createBooking, getUserBookings };
