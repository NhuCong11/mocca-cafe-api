const httpStatus = require('http-status');

const { Message } = require('../models');
const ApiError = require('../utils/ApiError');
const { messageMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const createMessage = async (messageBody) => {
  const message = await Message.create(messageBody);
  return message;
};

const getMessageById = async (messageId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }

  return message;
};

const getMessageBysenderId = async (sender) => {
  const messages = await Message.find({ sender });

  if (!messages) {
    throw new ApiError(httpStatus.NOT_FOUND, messageMessage().NOT_FOUND);
  }

  return messages;
};

const getMessagesByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Message);

  const { results, ...detailResult } = await apiFeature.getResults(query, ['sender', 'receiver', 'message']);

  return { messages: results, ...detailResult };
};

const deleteMessageById = async (messageId) => {
  const message = await getMessageById(messageId);

  await message.deleteOne();

  return message;
};

const deleteMessageBysenderId = async (sender) => {
  const message = await Message.deleteMany({ sender });
  return message;
};

module.exports = {
  createMessage,
  getMessageById,
  deleteMessageById,
  getMessageBysenderId,
  getMessagesByKeyword,
  deleteMessageBysenderId,
};
