const { i18nService } = require('../config');

const chatBotMessage = () => {
  return {
    RETRY: i18nService.translate('chatBot.retry'),
    FAILED: i18nService.translate('chatBot.failed'),
    SUCCESS: i18nService.translate('chatBot.success'),
  };
};

module.exports = chatBotMessage;
