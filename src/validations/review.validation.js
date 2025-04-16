const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    orderId: Joi.string().custom(objectId),
    rating: Joi.number().integer(),
    isReview: Joi.boolean(),
    comment: Joi.string().allow(null, ''),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    orderId: Joi.string().custom(objectId),
    rating: Joi.number().integer(),
    isReview: Joi.boolean(),
    comment: Joi.string().allow(null, ''),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      productId: Joi.string().custom(objectId),
      orderId: Joi.string().custom(objectId),
      rating: Joi.number().integer(),
      isReview: Joi.boolean(),
      comment: Joi.string().allow(null, ''),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
