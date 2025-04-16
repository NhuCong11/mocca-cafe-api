const express = require('express');
const { cartDetailController } = require('../../controllers');
const { cartDetailValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');

const cartDetailRouter = express.Router();

cartDetailRouter
  .route('/')
  .get(validate(cartDetailValidation.getCartDetails), cartDetailController.getCartDetails)
  .post(validate(cartDetailValidation.createCartDetail), cartDetailController.createCartDetail);

cartDetailRouter
  .route('/:cartDetailId')
  .get(validate(cartDetailValidation.getCartDetail), cartDetailController.getCartDetailById)
  .put(validate(cartDetailValidation.updateCartDetail), cartDetailController.updateCartDetail)
  .delete(validate(cartDetailValidation.deleteCartDetail), cartDetailController.deleteCartDetail);

module.exports = cartDetailRouter;
