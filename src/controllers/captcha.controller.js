const httpStatus = require('http-status');

const response = require('../utils/response');
const { captchaMessage } = require('../messages');
const catchAsync = require('../utils/catchAsync');
const { captchaService } = require('../services');

const generateCaptcha = catchAsync(async (req, res) => {
  const data = captchaService.generate();
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, captchaMessage().GENERATE_SUCCESS, { ...data }));
});

module.exports = {
  generateCaptcha,
};
