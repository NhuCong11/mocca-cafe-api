const Joi = require('joi');
const { password, objectId, email, role } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().custom(email),
    password: Joi.string().custom(password),
    role: Joi.string().custom(role),
    isLocked: Joi.boolean().valid(true, false),
    isVerify: Joi.boolean().valid(true, false),
    phone: Joi.string().allow(null, ''),
    dateOfBirth: Joi.date().allow(null, ''),
    address: Joi.string().allow(null, ''),
    avatar: Joi.string().allow(null, ''),
    gender: Joi.string().allow('male', 'female', ''),
    description: Joi.string().allow(null, ''),
    background: Joi.string().allow(null, ''),
    avatar: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    role: Joi.string().custom(role),
    isLocked: Joi.boolean().valid(true, false),
    isVerify: Joi.boolean().valid(true, false),
    gender: Joi.string().allow('male', 'female', ''),
    fullname: Joi.string().allow(null, ''),
    email: Joi.string().allow(null, ''),
    phone: Joi.string().allow(null, ''),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      fullname: Joi.string(),
      email: Joi.string().custom(email),
      password: Joi.string().custom(password),
      role: Joi.string().custom(role),
      isLocked: Joi.boolean().valid(true, false),
      isVerify: Joi.boolean().valid(true, false),
      phone: Joi.string().allow(null, ''),
      background: Joi.string().allow(null, ''),
      description: Joi.string().allow(null, ''),
      dateOfBirth: Joi.date().allow(null, ''),
      address: Joi.string().allow(null, ''),
      avatar: Joi.string().allow(null, ''),
      gender: Joi.string().allow('male', 'female', ''),
      avatar: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const lockUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  lockUser,
};
