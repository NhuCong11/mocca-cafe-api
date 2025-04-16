const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('product.notFound'),
    FIND_SUCCESS: i18nService.translate('product.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('product.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('product.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('product.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('product.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('product.findListSuccess'),
    IMPORT_SUCCESS: i18nService.translate('product.importSuccess'),
  };
};

module.exports = categoryMessage;
