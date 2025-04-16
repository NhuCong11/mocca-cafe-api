const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('review.notFound'),
    FIND_SUCCESS: i18nService.translate('review.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('review.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('review.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('review.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('review.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('review.findListSuccess'),
  };
};

module.exports = categoryMessage;
