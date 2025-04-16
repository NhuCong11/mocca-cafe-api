const { i18nService } = require('../config');

const contactMessage = () => {
  return {
    SEND_FAIL: i18nService.translate('contact.sendFail'),
    NOT_FOUND: i18nService.translate('contact.notFound'),
    SEND_SUCCESS: i18nService.translate('contact.sendSuccess'),
    FIND_SUCCESS: i18nService.translate('contact.findSuccess'),
    MESSAGE_LENGTH: i18nService.translate('contact.messageLength'),
    DELETE_SUCCESS: i18nService.translate('contact.deleteSuccess'),
    MESSAGE_REQUIRED: i18nService.translate('contact.messageRequired'),
    FIND_LIST_SUCCESS: i18nService.translate('contact.findListSuccess'),
  };
};

module.exports = contactMessage;
