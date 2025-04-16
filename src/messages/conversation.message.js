const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('conversation.notFound'),
    FIND_SUCCESS: i18nService.translate('conversation.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('conversation.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('conversation.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('conversation.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('conversation.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('conversation.findListSuccess'),
  };
};

module.exports = categoryMessage;
