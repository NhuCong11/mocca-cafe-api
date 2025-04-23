const express = require('express');
const { auth } = require('../middlewares/auth');
const { dashboardController } = require('../controllers');

const router = express.Router();

router.get('/statistical-user-by-role', auth(), dashboardController.statisticalUserByRole);
router.post('/statistical-data', auth(), dashboardController.statisticalData);
router.post('/statistical-revenue', auth(), dashboardController.statisticalRevenue);
router.post('/statistical-performance', auth(), dashboardController.statisticalPerformance);
router.get('/top-selling-products', auth(), dashboardController.getTopSellingProducts);

module.exports = router;
