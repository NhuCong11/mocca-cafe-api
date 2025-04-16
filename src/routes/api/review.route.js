const express = require('express');

const { reviewController } = require('../../controllers');
const { reviewValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(validate(reviewValidation.getReviews), reviewController.getReviews)
  .post(auth, authorize('admin'), validate(reviewValidation.createReview), reviewController.createReview);

reviewRouter.get(
  '/exports',
  auth,
  authorize('admin'),
  validate(reviewValidation.getReviews),
  reviewController.exportExcel,
);

reviewRouter
  .route('/:reviewId')
  .get(validate(reviewValidation.getReview), reviewController.getReviewById)
  .put(auth, authorize('admin'), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth, authorize('admin'), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = reviewRouter;
