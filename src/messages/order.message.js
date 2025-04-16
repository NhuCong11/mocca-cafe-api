const { i18nService } = require('../config');

const categoryMessage = () => {
  return {
    NOT_FOUND: i18nService.translate('order.notFound'),
    FIND_SUCCESS: i18nService.translate('order.findSuccess'),
    CREATE_SUCCESS: i18nService.translate('order.createSuccess'),
    UPDATE_SUCCESS: i18nService.translate('order.updateSuccess'),
    DELETE_SUCCESS: i18nService.translate('order.deleteSuccess'),
    ALREADY_EXISTS: i18nService.translate('order.alreadyExists'),
    FIND_LIST_SUCCESS: i18nService.translate('order.findListSuccess'),
    CANCEL_SUCCESS: i18nService.translate('order.cancelSuccess'),
    UPDATE_STATUS_SUCCESS: i18nService.translate('order.updateStatusSuccess'),
    MAXIUM_ORDER: i18nService.translate('order.maxiumOrder'),
    ERROR_ORDER: i18nService.translate('order.errorOrder'),
    LOW_BALANCE_ALERT: i18nService.translate('order.lowBalanceAlert'),
    ORDER_UPDATE_FORBIDDEN: i18nService.translate('order.orderUpdateForbidden'),
    CANCEL_ORDER_ERROR: i18nService.translate('order.cancelOrderError'),
    REJECT_ORDER_ERROR: i18nService.translate('order.rejectOrderError'),
    APPROVE_ORDER_ERROR: i18nService.translate('order.approveOrderError'),
    UNABLE_TO_UPDATE_ORDER_STATUS: i18nService.translate('order.unableToUpdateOrderStatus'),
    UNABLE_TO_COMPLETE_ORDER: i18nService.translate('order.unableToCompleteOrder'),
    INVALID_ORDER_STATUS: i18nService.translate('order.invalidOrderStatus'),
  };
};

module.exports = categoryMessage;
