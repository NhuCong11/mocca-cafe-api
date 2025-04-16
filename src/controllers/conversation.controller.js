const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');
const { conversationMessage } = require('../messages');

const createConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.createConversation(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, conversationMessage().CREATE_SUCCESS, conversation));
});

const getConversations = catchAsync(async (req, res) => {
  const conversations = await conversationService.getConversationsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, conversationMessage().FIND_LIST_SUCCESS, conversations));
});

const getConversationById = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await conversationService.getConversationById(conversationId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, conversationMessage().FIND_SUCCESS, conversation));
});

const updateConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await conversationService.updateConversationById(conversationId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, conversationMessage().UPDATE_SUCCESS, conversation));
});

const deleteConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await conversationService.deleteConversationById(conversationId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, conversationMessage().DELETE_SUCCESS, conversation));
});

module.exports = {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  getConversationById,
};
