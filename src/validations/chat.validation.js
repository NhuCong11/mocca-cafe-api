const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
  body: Joi.object()
    .keys({
      senderId: Joi.string().custom(objectId),
      receiverId: Joi.string().custom(objectId),
      message: Joi.string().allow(null, ''),
      image: Joi.string(),
    })
    .min(2),
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
    image: Joi.string().allow(null, ''),
  }),
};

const getListUsersChat = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    userId: Joi.string().custom(objectId),
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
  getListUsersChat,
  deleteMessageBysenderId,
};
