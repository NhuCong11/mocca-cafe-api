const express = require('express');

const { contactController } = require('../../controllers');
const { contactValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const contactRouter = express.Router();

contactRouter
  .route('/')
  .get(auth, authorize('admin'), validate(contactValidation.getContacts), contactController.getContacts)
  .post(validate(contactValidation.createContact), contactController.createContact);

contactRouter.get(
  '/exports',
  auth,
  authorize('admin'),
  validate(contactValidation.getContacts),
  contactController.exportExcel,
);

contactRouter
  .route('/:contactId')
  .get(auth, authorize('admin'), validate(contactValidation.getContact), contactController.getContact)
  .delete(auth, authorize('admin'), validate(contactValidation.deleteContact), contactController.deleteContact);

module.exports = contactRouter;
