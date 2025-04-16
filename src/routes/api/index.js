const express = require('express');

const apiRoute = express.Router();

const listRoutesApi = [
  {
    path: '/users',
    route: require('./user.route'),
  },
  {
    path: '/auth',
    route: require('./auth.route'),
  },
  {
    path: '/categories',
    route: require('./category.route'),
  },
  {
    path: '/products',
    route: require('./product.route'),
  },
  {
    path: '/contacts',
    route: require('./contact.route'),
  },
  {
    path: '/messages',
    route: require('./message.route'),
  },
  {
    path: '/cart-details',
    route: require('./cart-detail.route'),
  },
  {
    path: '/carts',
    route: require('./cart.route'),
  },
  {
    path: '/orders',
    route: require('./order.route'),
  },
  {
    path: '/conversations',
    route: require('./conversation.route'),
  },
  {
    path: '/reviews',
    route: require('./review.route'),
  },
  {
    path: '/chats',
    route: require('./chat.route'),
  },
  {
    path: '/chat-bots',
    route: require('./chat-bot.route'),
  },
  {
    path: '/captcha',
    route: require('./captcha.route'),
  },
  {
    path: '/shops',
    route: require('./shop.route'),
  },
  {
    path: '/dashboards',
    route: require('./dashboard.route'),
  },
];

listRoutesApi.forEach((route) => {
  apiRoute.use(route.path, route.route);
});

module.exports = apiRoute;
