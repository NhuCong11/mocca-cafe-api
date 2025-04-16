const express = require('express');

const { orderController } = require('../../controllers');
const { orderValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const orderRouter = express.Router();

orderRouter
  .route('/')
  .post(auth, authorize('user'), validate(orderValidation.createOrder), orderController.createOrder);

orderRouter.get('/exports', auth, authorize('admin'), validate(orderValidation.getOrders), orderController.exportExcel);

orderRouter.get('/me', auth, authorize('user'), validate(orderValidation.getMyOrders), orderController.getMyOrders);

orderRouter.post(
  '/:orderId/cancel',
  auth,
  authorize(['shop', 'user']),
  validate(orderValidation.getOrder),
  orderController.cancelOrderById,
);

orderRouter
  .route('/:orderId/status')
  .put(auth, authorize('shop'), validate(orderValidation.updateStatusOrder), orderController.updateStatusOrder);

module.exports = orderRouter;
