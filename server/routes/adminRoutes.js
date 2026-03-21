const express = require('express');
const router = express.Router();
const { createMovie, getMovies, createShow, getShows } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/movies', authenticate, authorize('admin'), createMovie);
router.get('/movies', authenticate, authorize('admin'), getMovies);
router.post('/shows', authenticate, authorize('admin'), createShow);
router.get('/shows', authenticate, authorize('admin'), getShows);

module.exports = router;
