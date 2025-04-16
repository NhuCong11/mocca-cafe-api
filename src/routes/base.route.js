const express = require('express');

const { uploadService } = require('../services');
const { baseController } = require('../controllers');
const { shopController } = require('../controllers');
const { systemValidation } = require('../validations');
const validate = require('../middlewares/validate.middleware');
const authApiKey = require('../middlewares/auth-api-key.middleware');
const { auth, authorize } = require('../middlewares/auth.middleware');

const baseRouter = express.Router();

baseRouter.get('/', baseController.getHome);

baseRouter.all('/health-check', baseController.healthCheck);

baseRouter.get('/locales/:lang', baseController.changeLanguage);

baseRouter.get('/logs', authApiKey('cronJob'), baseController.sendLogs);

baseRouter.get('/api/v1/restaurants/search', shopController.searchRestaurants);

baseRouter.get('/count-access', authApiKey('cronJob'), baseController.countAccess);

baseRouter.post('/gateway/payment', authApiKey('payment'), baseController.sendSocketPayment);

baseRouter.get('/qr-code', validate(systemValidation.renderQRCode), baseController.renderQR);

baseRouter.post(
  '/api/v1/images',
  auth,
  authorize('admin'),
  uploadService.uploadImage.single('image'),
  baseController.uploadImage,
);

baseRouter.all('*', baseController.handlerNotFound);

module.exports = baseRouter;
