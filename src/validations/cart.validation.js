const Joi = require('joi');
const { objectId, quantity } = require('./custom.validation');

const addProductToCart = {
  body: Joi.object().keys({
    quantity: Joi.number().integer().custom(quantity),
    product: Joi.string().custom(objectId).required(),
    classify: Joi.string().required(),
  }),
};

const removeProductFromCart = {
  body: Joi.object().keys({
    isDeleteAll: Joi.boolean(),
    quantity: Joi.number().integer().custom(quantity),
    product: Joi.string().custom(objectId).required(),
  }),
};

const getCarts = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    cartDetailId: Joi.array().allow(null, ''),
    userId: Joi.string().custom(objectId),
    isOrder: Joi.boolean().allow(null, ''),
  }),
};

const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      cartDetailId: Joi.array().allow(null, ''),
      userId: Joi.string().custom(objectId),
      isOrder: Joi.boolean().allow(null, ''),
    })
    .min(1),
};

const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getCart,
  getCarts,
  updateCart,
  deleteCart,
  addProductToCart,
  removeProductFromCart,
};
