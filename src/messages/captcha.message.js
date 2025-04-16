const { i18nService } = require('../config');

const captchaMessage = () => {
  return {
    INVALID_CAPTCHA: i18nService.translate('captcha.invalidCaptcha'),
    GENERATE_SUCCESS: i18nService.translate('captcha.generateSuccess'),
  };
};

module.exports = captchaMessage;
