const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    cartDetails: Joi.array().items(Joi.string().custom(objectId)).min(1),
    address: Joi.string().allow(null, ''),
    note: Joi.string().allow(null, ''),
    paymentMethod: Joi.string().allow('cod', 'bank', 'prepaid'),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    userId: Joi.string().custom(objectId),
    cartId: Joi.string().custom(objectId),
    address: Joi.string().allow(null, ''),
    note: Joi.string().allow(null, ''),
    status: Joi.string().allow(null, ''),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateStatusOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().allow('pending', 'canceled', 'confirmed', 'reject', 'shipping', 'success'),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const getMyOrders = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    status: Joi.string().allow('pending', 'canceled', 'confirmed', 'reject', 'shipping', 'success', ''),
  }),
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  getOrder,
  updateStatusOrder,
  deleteOrder,
};
