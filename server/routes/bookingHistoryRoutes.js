const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

router.get('/:userId', authenticate, getUserBookings);

module.exports = router;

module.exports = router;
