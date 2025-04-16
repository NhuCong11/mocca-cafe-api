const httpStatus = require('http-status');

const { Conversation } = require('../models');
const ApiError = require('../utils/ApiError');
const { cartDetailMessage, conversationMessage } = require('../messages');

const getConversationById = async (conversatioId) => {
  const conversation = await Conversation.findById(conversatioId);

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, cartDetailMessage().NOT_FOUND);
  }

  return conversation;
};

const createConversation = async (conversationBody) => {
  const { participants } = conversationBody;

  const conversation = await Conversation.findOne({ participants });

  if (conversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, conversationMessage().ALREADY_EXISTS);
  }

  const newConversation = await Conversation.create(conversationBody);

  return newConversation;
};

const getConversationsByKeyword = async (query) => {
  const conversations = await Conversation.find(query);
  return conversations;
};

const updateConversationById = async (conversationId, updateBody) => {
  const conversation = await getConversationById(conversationId);

  Object.assign(conversation, updateBody);
  await conversation.save();

  return conversation;
};

const deleteConversationById = async (conversationId) => {
  const conversation = await getConversationById(conversationId);

  await conversation.deleteOne();

  return conversation;
};

module.exports = {
  createConversation,
  getConversationById,
  updateConversationById,
  deleteConversationById,
  getConversationsByKeyword,
};
