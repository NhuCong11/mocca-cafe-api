const express = require('express');

const { chatBotConterller } = require('../../controllers');
const { chatBotValidation } = require('../../validations');
const { auth } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');

const chatBotRouter = express.Router();

chatBotRouter.post('/', auth, validate(chatBotValidation.sendMessage), chatBotConterller.chatBot);

module.exports = chatBotRouter;
