// GameTracker-Backend/routes/reviews.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const { getReviews, createReview, deleteReview, updateReview } = require('../controllers/reviewController');

router.use(requireAuth);

router.get('/', getReviews);
router.post('/', createReview);
router.delete('/:id', deleteReview);
router.put('/:id', updateReview);

module.exports = router;