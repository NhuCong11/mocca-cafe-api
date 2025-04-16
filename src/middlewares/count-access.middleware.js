const cacheService = require('../services/cache.service');
const { KEY_CACHE_ACCESS, TTL_CACHE_ACCESS } = require('../constants');

const countAccess = (req, res, next) => {
  let totalAccess = cacheService.get(KEY_CACHE_ACCESS) || 0;

  totalAccess = +totalAccess + 1;

  cacheService.set(KEY_CACHE_ACCESS, totalAccess, TTL_CACHE_ACCESS);

  next();
};

module.exports = countAccess;
