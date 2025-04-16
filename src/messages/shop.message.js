const { i18nService } = require('../config');

const shopMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('shop.notFound'),
    SHOP_DETAIL: i18nService.translate('shop.shopDetail'),
    RESULT_FIND: i18nService.translate('shop.resultFind'),
    FIND_SUCCESS: i18nService.translate('shop.findSuccess'),
    FIND_BY_CATEGORY: i18nService.translate('shop.findByCategory'),
    SHOPS_BY_CATEGORY: i18nService.translate('shop.shopsByCategory'),
    LIST_ORDER_OF_SHOP: i18nService.translate('shop.listOrderOfShop'),
  };
};

module.exports = shopMessage;
