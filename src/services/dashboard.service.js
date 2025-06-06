const { User, Order, Contact, Product } = require('../models');
const cacheService = require('../services/cache.service');
const {
  statisticalRevenueByDay,
  statisticalRevenueByMonth,
  statisticalRevenueByQuarter,
  statisticalRevenueByYear,
  statisticalPerformanceByDay,
  statisticalPerformanceByMonth,
  statisticalPerformanceByQuarter,
  statisticalPerformanceByYear,
} = require('../utils/statisticalService');
const keyDashboard = 'dashboard';

const statisticalUserByRole = async () => {
  const resultCache = await cacheService.get(`${keyDashboard}:statisticalUserByRole`);

  if (resultCache) return resultCache;

  const data = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  let total = 0;
  const roles = data.map((item) => {
    total += item.count;
    return { [item._id]: item.count };
  });

  const result = {
    total: total,
    roles: roles,
  };

  cacheService.set(`${keyDashboard}:statisticalUserByRole`, result);

  return result;
};
const statisticalData = async (reqBody, user) => {
  const { statisticalBy } = reqBody;

  let startDate, endDate;
  const now = new Date();
  switch (statisticalBy) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'quarter':
      const currentMonth = now.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3) + 1;
      startDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
      endDate = new Date(now.getFullYear(), currentQuarter * 3, 0);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
  }

  endDate = new Date(endDate.setHours(23, 59, 59, 999));
  const cacheKey = `${user.role}:${user.shopId || 'all'}:${startDate.toISOString()}:${endDate.toISOString()}:statisticalData`;
  const resultCache = await cacheService.get(cacheKey);

  if (resultCache) return resultCache;

  const allPossibleStatuses = Order.schema.path('status').enumValues;

  // Thêm điều kiện lọc theo shop nếu không phải admin
  const matchCondition = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (user.role === 'shop' && user.shopId) {
    matchCondition.shopId = user.shopId;
  }

  const collections = {
    sales: {
      collection: Order,
      groupField: { totalMoney: { $sum: '$totalMoney' } },
      totalField: 'totalMoney',
    },
    newUser: {
      collection: User,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
    order: {
      collection: Order,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
    message: {
      collection: Contact,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
    statusOrder: {
      collection: Order,
      groupField: { count: { $sum: 1 } },
      totalField: 'count',
    },
  };

  const results = {};

  for (const [key, { collection, groupField, totalField }] of Object.entries(collections)) {
    const data = await collection.aggregate([
      {
        $match: matchCondition,
      },
      key === 'statusOrder'
        ? {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          }
        : {
            $group: {
              _id: null,
              ...groupField,
            },
          },
    ]);

    if (key === 'statusOrder') {
      const statusCounts = data.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      results[key] = allPossibleStatuses.reduce((acc, status) => {
        acc[status] = statusCounts[status] || 0;
        return acc;
      }, {});
    } else {
      results[key] = data.length > 0 ? data[0][totalField] : 0;
    }
  }

  cacheService.set(cacheKey, results);
  return results;
};

const statisticalRevenue = async (reqBody, user) => {
  const { statisticalBy } = reqBody;

  let year;
  const endDate = new Date();
  const startDate = new Date(endDate);
  switch (statisticalBy) {
    case 'day':
      return statisticalRevenueByDay(
        new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 6),
        new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
        user,
      );
    case 'week':
      return statisticalRevenueByDay(
        new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - endDate.getDay() + 1),
        new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - endDate.getDay() + 7),
        user,
      );
    case 'month':
      startDate.setMonth(endDate.getMonth() - 2);
      return statisticalRevenueByMonth(startDate, new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0), user);
    case 'quarter':
      year = endDate.getFullYear();
      return statisticalRevenueByQuarter(year, user);
    case 'year':
      year = endDate.getFullYear();
      return statisticalRevenueByYear(year, user);
    default:
      year = endDate.getFullYear();
      return statisticalRevenueByYear(year, user);
  }
};

const statisticalPerformance = async (reqBody, user) => {
  const { statisticalBy } = reqBody;

  let startDate, endDate;
  const now = new Date();
  switch (statisticalBy) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return statisticalPerformanceByDay(startDate, endDate, user);
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
      return statisticalPerformanceByDay(startDate, endDate, user);
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return statisticalPerformanceByMonth(startDate, endDate, user);
    case 'quarter':
      year = now.getFullYear();
      return statisticalPerformanceByQuarter(year, user);
    case 'year':
      year = now.getFullYear();
      return statisticalPerformanceByYear(year, user);
    default:
      year = now.getFullYear();
      return statisticalPerformanceByYear(year, user);
  }
};

const getTopSellingProducts = async (user) => {
  const cacheKey = `${keyDashboard}:topSellingProducts:${user.role}:${user._id || 'all'}`;
  const resultCache = await cacheService.get(cacheKey);

  if (resultCache) return resultCache;

  const matchCondition = {
    status: 'success',
  };

  if (user.role === 'shop') {
    matchCondition.shop = user._id;
  }

  const result = await Order.aggregate([
    {
      $match: matchCondition,
    },
    {
      $unwind: '$cartDetails',
    },
    {
      $lookup: {
        from: 'cartdetails',
        localField: 'cartDetails',
        foreignField: '_id',
        as: 'cartDetailInfo',
      },
    },
    {
      $unwind: '$cartDetailInfo',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'cartDetailInfo.product',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    {
      $unwind: '$productInfo',
    },
    {
      $match: {
        'productInfo.shop': user.role === 'shop' ? user._id : { $exists: true },
      },
    },
    {
      $group: {
        _id: '$cartDetailInfo.product',
        name: { $first: '$productInfo.name' },
        image: { $first: '$productInfo.image' },
        totalQuantity: { $sum: '$cartDetailInfo.quantity' },
        totalRevenue: { $sum: { $multiply: ['$cartDetailInfo.totalPrice', 1] } },
      },
    },
    {
      $sort: { totalQuantity: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  cacheService.set(cacheKey, result);
  return result;
};

module.exports = {
  statisticalUserByRole,
  statisticalData,
  statisticalRevenue,
  statisticalPerformance,
  getTopSellingProducts,
};
