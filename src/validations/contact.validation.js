const Joi = require('joi');
const { objectId, email, fullname, phone, message } = require('./custom.validation');

const createContact = {
  body: Joi.object().keys({
    fullname: Joi.string().optional().custom(fullname),
    email: Joi.string().optional().custom(email),
    phone: Joi.string().optional().custom(phone),
    message: Joi.string().custom(message),
  }),
};

const getContacts = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    fullname: Joi.string().allow(null, ''),
    email: Joi.string().allow(null, ''),
    phone: Joi.string().allow(null, ''),
    message: Joi.string().allow(null, ''),
  }),
};

const getContact = {
  params: Joi.object().keys({
    contactId: Joi.string().custom(objectId),
  }),
};

const deleteContact = {
  params: Joi.object().keys({
    contactId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  deleteContact,
};
