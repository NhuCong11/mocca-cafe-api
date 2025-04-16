const express = require('express');

const { conversationController } = require('../../controllers');
const { conversationValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const conversationRouter = express.Router();

conversationRouter
  .route('/')
  .get(validate(conversationValidation.getConversations), conversationController.getConversations)
  .post(
    auth,
    authorize('admin'),
    validate(conversationValidation.createConversation),
    conversationController.createConversation,
  );

conversationRouter
  .route('/:conversationId')
  .get(validate(conversationValidation.getConversation), conversationController.getConversationById)
  .put(
    auth,
    authorize('admin'),
    validate(conversationValidation.updateConversation),
    conversationController.updateConversation,
  )
  .delete(
    auth,
    authorize('admin'),
    validate(conversationValidation.deleteConversation),
    conversationController.deleteConversation,
  );

module.exports = conversationRouter;
