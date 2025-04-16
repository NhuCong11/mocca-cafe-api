const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
  body: Joi.object().keys({
    senderId: Joi.string().custom(objectId),
    receiverId: Joi.string().custom(objectId),
    message: Joi.string().required(),
  }),
};

const getMessages = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    senderId: Joi.string().custom(objectId),
    receiverId: Joi.string().custom(objectId),
    message: Joi.string().allow(null, ''),
  }),
};

const getMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const deleteMessageBysenderId = {
  params: Joi.object().keys({
    senderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  deleteMessage,
  deleteMessageBysenderId,
};
