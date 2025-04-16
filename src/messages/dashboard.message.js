const { i18nService } = require('../config');

const dashboardMessage = () => {
  return {
    STATISTICAL_DATA: i18nService.translate('dashboard.statisticalData'),
    STATISTICAL_REVENUE: i18nService.translate('dashboard.statisticalRevenue'),
    STATISTICAL_PERFORMANCE: i18nService.translate('dashboard.statisticalPerformance'),
    STATISTICAL_USER_BY_ROLE: i18nService.translate('dashboard.statisticalUserByRole'),
  };
};

module.exports = dashboardMessage;
