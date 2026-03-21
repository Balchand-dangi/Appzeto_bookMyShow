const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, createBooking);

module.exports = router;
