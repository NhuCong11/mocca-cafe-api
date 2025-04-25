const httpStatus = require('http-status');

const { chatAI } = require('../config');
const ApiError = require('../utils/ApiError');
const response = require('../utils/response');
const { chatBotMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');

const chatBot = catchAsync(async (req, res) => {
  try {
    const chat = chatAI.startChat();

    const { message } = req.body;

    const result = await chat.sendMessage(message);
    if (!result) throw new ApiError(httpStatus.BAD_REQUEST, chatBotMessage().RETRY);

    const aiResponse = result.response.text();
    if (!aiResponse) throw new ApiError(httpStatus.BAD_REQUEST, chatBotMessage().RETRY);

    chatAI.addToHistory('user', message);
    chatAI.addToHistory('model', aiResponse);

    return res.status(httpStatus.OK).json(response(httpStatus.OK, chatBotMessage().SUCCESS, aiResponse));
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error with Gemini API: ${error.message || 'Unknown error'}`);
  }
});

module.exports = { chatBot };
