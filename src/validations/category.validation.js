const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCateogry = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    name: Joi.string().allow(null, ''),
    slug: Joi.string().allow(null, ''),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCateogry,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
