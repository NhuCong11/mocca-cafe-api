const Joi = require('joi');
const { uriQRCode } = require('./custom.validation');

const renderQRCode = {
  query: Joi.object().keys({
    uri: Joi.string().required().custom(uriQRCode),
  }),
};

module.exports = {
  renderQRCode,
};
