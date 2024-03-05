const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restricTo('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(authController.protect, authController.restricTo('user', 'admin'), reviewController.deleteReview);
module.exports = router;
