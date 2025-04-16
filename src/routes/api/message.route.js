const express = require('express');

const { messageController } = require('../../controllers');
const { messageValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');

const messageRouter = express.Router();

messageRouter
  .route('/')
  .get(validate(messageValidation.getMessages), messageController.getMessages)
  .post(validate(messageValidation.createMessage), messageController.createMessage);

messageRouter
  .route('/:messageId')
  .get(validate(messageValidation.getMessage), messageController.getMessageById)
  .delete(validate(messageValidation.deleteMessage), messageController.deleteMessageById);

messageRouter
  .route('/users/:senderId')
  .get(validate(messageValidation.getMessages), messageController.getMessagesBysenderId)
  .delete(validate(messageValidation.deleteProuductBysenderId), messageController.deleteMessageBysenderId);

module.exports = messageRouter;
