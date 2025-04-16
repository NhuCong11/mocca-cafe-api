const express = require('express');

const { shopController } = require('../../controllers');
const { shopValidation } = require('../../validations');
const validate = require('../../middlewares/validate.middleware');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const shopRouter = express.Router();

shopRouter.get(
  '/:shopId/group-by-category',
  validate(shopValidation.getDetailShop),
  shopController.getDetailShopGroupByCategory,
);

shopRouter.get('/category/:categoryId', validate(shopValidation.getShopsByCategory), shopController.getShopsByCategory);

shopRouter.get('/orders', auth, authorize('shop'), validate(shopValidation.getMyOrders), shopController.getMyOrders);

shopRouter.get('/:shopId', validate(shopValidation.getDetailShop), shopController.getDetailShop);

shopRouter.get('/', validate(shopValidation.getShops), shopController.getShops);

module.exports = shopRouter;
