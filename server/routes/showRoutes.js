const express = require('express');
const router = express.Router();
const { getShowsByMovieId } = require('../controllers/movieController');
const { lockSeats } = require('../controllers/seatController');

router.get('/:movieId', getShowsByMovieId);
router.post('/lock', lockSeats);

module.exports = router;
