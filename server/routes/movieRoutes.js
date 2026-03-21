const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, getShowsByMovieId } = require('../controllers/movieController');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);

module.exports = router;
