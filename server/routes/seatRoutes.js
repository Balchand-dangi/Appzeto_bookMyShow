const express = require('express');
const router = express.Router();
const { lockSeats } = require('../controllers/seatController');
const { authenticate } = require('../middleware/auth');

router.post('/lock', authenticate, lockSeats);

module.exports = router;
