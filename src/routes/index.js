const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const shopRoute = require('./shop.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');
const contactRoute = require('./contact.route');
const dashboardRoute = require('./dashboard.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/shops', shopRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);
router.use('/contacts', contactRoute);
router.use('/dashboards', dashboardRoute);

module.exports = router;
