const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string(),
    description: Joi.string().allow(null, ''),
    price: Joi.number().required(),
    classifies: Joi.string().required(),
    category: Joi.string().required().custom(objectId),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    shop: Joi.string().custom(objectId).allow(null, ''),
    category: Joi.string().custom(objectId).allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string().allow(null, ''),
    price: Joi.number(),
    classifies: Joi.string().required(),
    category: Joi.string().custom(objectId),
  }),
};

const deleteProuduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const deleteProuductByuserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteProuductBycategoryId = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProuduct,
  deleteProuductByuserId,
  deleteProuductBycategoryId,
};
