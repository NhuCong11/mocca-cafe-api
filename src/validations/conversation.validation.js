const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createConversation = {
  body: Joi.object().keys({
    participants: Joi.array().required(),
    message: Joi.array().required(),
  }),
};

const getConversations = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    lang: Joi.string(),
    participants: Joi.array().allow(null, ''),
    message: Joi.array().allow(null, ''),
    slug: Joi.string().allow(null, ''),
  }),
};

const getConversation = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
};

const updateConversation = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      participants: Joi.array().allow(null, ''),
      message: Joi.array().allow(null, ''),
    })
    .min(1),
};

const deleteConversation = {
  params: Joi.object().keys({
    conversationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation,
};
