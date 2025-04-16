const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('message.notFound'),
    FIND_SUCCESS: i18nService.translate('message.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('message.createSuccess'),
    DELETE_SUCCESS: i18nService.translate('message.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('message.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('message.findListSuccess'),
  };
};

module.exports = categoryMessage;
