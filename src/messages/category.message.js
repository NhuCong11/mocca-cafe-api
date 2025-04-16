const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('category.notFound'),
    FIND_SUCCESS: i18nService.translate('category.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('category.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('category.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('category.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('category.alreadyExists'),
    IMPORT_SUCCESS: i18nService.translate('category.importSuccess'),
    FIND_LIST_SUCCESS: i18nService.translate('category.findListSuccess'),
  };
};

module.exports = categoryMessage;
