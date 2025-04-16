const express = require('express');

const { captchaController } = require('../../controllers');

const captchaRouter = express.Router();

captchaRouter.get('/generate', captchaController.generateCaptcha);

module.exports = captchaRouter;
