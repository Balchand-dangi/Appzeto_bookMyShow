const Show = require('../models/Show');

// Helper: calculate seat price based on seat number
const getSeatPrice = (seatNumber) => {
    if (seatNumber >= 1 && seatNumber <= 10) return 150;   // Row A - Standard
    if (seatNumber >= 11 && seatNumber <= 20) return 180;  // Row B - Premium
    if (seatNumber >= 21 && seatNumber <= 30) return 200;  // Row C - VIP
    return 0;
};

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

// POST /api/seats/lock
const lockSeats = async (req, res, next) => {
    try {
        const { showId, seats } = req.body;
        const userId = req.user.id; // From JWT token

        if (!showId) {
            return res.status(400).json({ message: 'showId is required' });
        }
        if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: 'seats must be a non-empty array' });
        }

        // Validate seat numbers are in range
        const invalidSeats = seats.filter(s => s < 1 || s > 30 || !Number.isInteger(s));
        if (invalidSeats.length > 0) {
            return res.status(400).json({ message: `Seat numbers must be integers between 1 and 30. Invalid: ${invalidSeats.join(', ')}` });
        }

        // Lazy expiry clear
        await clearExpiredLocks(showId);

        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        const now = new Date();
        const conflictSeats = [];

        for (const seatNum of seats) {
            const seat = show.seats.find(s => s.seatNumber === seatNum);
            if (!seat) {
                conflictSeats.push({ seatNumber: seatNum, reason: 'Seat not found' });
                continue;
            }
            if (seat.isBooked) {
                conflictSeats.push({ seatNumber: seatNum, reason: 'Already booked' });
            } else if (seat.lockedBy && seat.lockedBy.toString() !== userId.toString() && seat.lockExpiry > now) {
                conflictSeats.push({ seatNumber: seatNum, reason: `Temporarily held by another user until ${seat.lockExpiry.toISOString()}` });
            }
        }

        if (conflictSeats.length > 0) {
            return res.status(409).json({
                message: 'One or more seats are unavailable',
                conflictSeats,
            });
        }

        // Lock the seats for 2 minutes
        const lockExpiry = new Date(now.getTime() + 2 * 60 * 1000);
        for (const seatNum of seats) {
            const seat = show.seats.find(s => s.seatNumber === seatNum);
            if (seat) {
                seat.lockedBy = userId;
                seat.lockExpiry = lockExpiry;
            }
        }

        await show.save();

        return res.status(200).json({
            message: 'Seats locked successfully',
            lockedSeats: seats,
            lockExpiry,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid showId format' });
        }
        next(err);
    }
};

module.exports = { lockSeats, getSeatPrice };
