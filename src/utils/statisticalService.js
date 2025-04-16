const { Order, DailyAccess } = require('../models');
const cacheService = require('../services/cache.service');

const statisticalRevenueByDay = async (startDate, endDate) => {
  const cacheKey = `${startDate}:${endDate}:statisticalRevenueByDay`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const allDates = generateDateRange(startDate, endDate);
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        totalRevenue: { $sum: '$totalMoney' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const revenueByDay = await Order.aggregate(pipeline);
  const result = mergeRevenueWithAllDates(revenueByDay, allDates);
  cacheService.set(cacheKey, result);
  return result;
};

const generateDateRange = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
};

const mergeRevenueWithAllDates = (revenueByDay) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = dayNames.map((day, index) => {
    const found = revenueByDay.find((item) => item._id === index + 1);
    return {
      _id: day,
      totalRevenue: found ? found.totalRevenue : 0,
    };
  });
  return result;
};

const statisticalRevenueByMonth = async (startMonth, endMonth) => {
  const cacheKey = `${startMonth}:${endMonth}:statisticalRevenueByMonth`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const allWeeks = generateWeekRangeForMonths(startMonth, endMonth);
  const pipelineByWeek = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startMonth),
          $lte: new Date(endMonth),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          week: { $isoWeek: '$createdAt' },
        },
        totalRevenue: { $sum: '$totalMoney' },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 },
    },
  ];

  const revenueByWeek = await Order.aggregate(pipelineByWeek);
  const result = mergeRevenueWithAllWeeks(revenueByWeek, allWeeks);
  cacheService.set(cacheKey, result);
  return result;
};

const generateWeekRangeForMonths = (startMonth, endMonth) => {
  const weekArray = [];
  let currentDate = new Date(startMonth);
  while (currentDate <= endMonth) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6);
    weekArray.push({ start: weekStart, end: weekEnd });
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weekArray;
};

const mergeRevenueWithAllWeeks = (revenueByWeek, allWeeks) => {
  const result = allWeeks.map((week, idx) => {
    const found = revenueByWeek.find(
      (item) => item._id.year === week.start.getFullYear() && getISOWeekNumber(week.start) === item._id.week,
    );
    return {
      _id: `week ${idx + 1}`,
      totalRevenue: found ? found.totalRevenue : 0,
    };
  });
  return result;
};

const getISOWeekNumber = (date) => {
  const tempDate = new Date(date);
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
  return weekNo;
};

const statisticalRevenueByQuarter = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  const cacheKey = `${year}:statisticalRevenueByYear`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const allQuarters = generateQuarterRange(startDate, endDate);
  const pipelineByQuarter = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $lte: [{ $month: '$createdAt' }, 3] },
            'Q1',
            {
              $cond: [
                { $lte: [{ $month: '$createdAt' }, 6] },
                'Q2',
                {
                  $cond: [{ $lte: [{ $month: '$createdAt' }, 9] }, 'Q3', 'Q4'],
                },
              ],
            },
          ],
        },
        totalRevenue: { $sum: '$totalMoney' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const revenueByQuarter = await Order.aggregate(pipelineByQuarter);
  const result = mergeRevenueWithAllQuarters(revenueByQuarter, allQuarters);
  cacheService.set(cacheKey, result);
  return result;
};

const generateQuarterRange = (startDate, endDate) => {
  const quarterArray = [];
  let currentQuarter = new Date(startDate);
  while (currentQuarter <= endDate) {
    const quarterStart = new Date(currentQuarter.getFullYear(), Math.floor(currentQuarter.getMonth() / 3) * 3, 1);
    const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
    quarterArray.push({ start: quarterStart, end: quarterEnd });
    currentQuarter = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3);
  }
  return quarterArray;
};

const mergeRevenueWithAllQuarters = (revenueByQuarter, allQuarters) => {
  const result = allQuarters.map((quarter, index) => {
    const quarterId = `Q${index + 1}`;
    const found = revenueByQuarter.find((item) => item._id === quarterId);
    return {
      _id: quarterId,
      totalRevenue: found ? found.totalRevenue : 0,
    };
  });
  return result;
};

const statisticalRevenueByYear = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  const cacheKey = `${year}:statisticalRevenueByYear`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const pipelineByMonth = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalRevenue: { $sum: '$totalMoney' },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ];

  const revenueByMonth = await Order.aggregate(pipelineByMonth);
  const result = mergeRevenueWithAllMonths(revenueByMonth, year);
  cacheService.set(cacheKey, result);
  return result;
};

const generateMonthRangeForYear = (year) => {
  const monthArray = [];
  for (let month = 1; month <= 12; month++) {
    monthArray.push({ year: year, month: month });
  }
  return monthArray;
};

const mergeRevenueWithAllMonths = (revenueByMonth, year) => {
  const allMonths = generateMonthRangeForYear(year);
  const result = allMonths.map((month) => {
    const found = revenueByMonth.find((item) => item._id.month === month.month);
    return {
      _id: formatMonth(month.month),
      totalRevenue: found ? found.totalRevenue : 0,
    };
  });
  return result;
};

const formatMonth = (month) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthNames[month - 1];
};

const statisticalPerformanceByDay = async (startDate, endDate) => {
  // Tạo khóa cache từ startDate và endDate
  const cacheKey = `${startDate}:${endDate}:statisticalPerformanceByDay`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const allDates = generatePerformanceDateRange(startDate, endDate);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const accessesPipeline = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        totalAccess: { $sum: '$total' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const accessesByDay = await DailyAccess.aggregate(accessesPipeline);

  const ordersPipeline = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        totalOrder: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const ordersByDay = await Order.aggregate(ordersPipeline);

  const mergedResults = mergePerformanceWithAllDates(accessesByDay, ordersByDay, allDates).map((dayData) => ({
    ...dayData,
    day: dayNames[dayData._id - 1],
  }));

  const sortedResults = dayNames.map(
    (dayName) =>
      mergedResults.find((dayData) => dayData.day === dayName) || { day: dayName, totalAccess: 0, totalOrder: 0 },
  );

  cacheService.set(cacheKey, sortedResults);
  return sortedResults;
};

const mergePerformanceWithAllDates = (accessesByDay, ordersByDay, allDates) => {
  const accessMap = accessesByDay.reduce((acc, data) => {
    acc[data._id] = data;
    return acc;
  }, {});

  const orderMap = ordersByDay.reduce((acc, data) => {
    acc[data._id] = data;
    return acc;
  }, {});

  return allDates.map((date) => ({
    _id: date,
    totalAccess: accessMap[date] ? accessMap[date].totalAccess : 0,
    totalOrder: orderMap[date] ? orderMap[date].totalOrder : 0,
  }));
};

const generatePerformanceDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  while (start <= end) {
    dateArray.push(start.getDay() + 1); // $dayOfWeek in MongoDB returns 1 (Sunday) to 7 (Saturday)
    start.setDate(start.getDate() + 1);
  }
  return dateArray;
};

const statisticalPerformanceByMonth = async (startMonth, endMonth) => {
  const cacheKey = `${startMonth}:${endMonth}:statisticalPerformanceByDay`;
  const cachedResult = await cacheService.get(cacheKey);
  if (cachedResult) return cachedResult;

  const getDailyAggregateData = async (model, field, countOrders = false) => {
    return await model.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startMonth), $lte: new Date(endMonth) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          total: countOrders ? { $sum: 1 } : { $sum: `$${field}` },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
  };

  const accessData = await getDailyAggregateData(DailyAccess, 'total');
  const orderData = await getDailyAggregateData(Order, 'total', true);

  const mergedResults = mergeDailyData(accessData, orderData, startMonth, endMonth);

  cacheService.set(cacheKey, mergedResults);
  return mergedResults;
};

const mergeDailyData = (accessData, orderData, startMonth, endMonth) => {
  const mergedResults = [];
  const startDate = new Date(startMonth);
  const endDate = new Date(endMonth);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const access = accessData.find(
      (item) =>
        item._id.year === currentDate.getFullYear() &&
        item._id.month === currentDate.getMonth() + 1 &&
        item._id.day === currentDate.getDate(),
    );
    const order = orderData.find(
      (item) =>
        item._id.year === currentDate.getFullYear() &&
        item._id.month === currentDate.getMonth() + 1 &&
        item._id.day === currentDate.getDate(),
    );

    mergedResults.push({
      date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
      totalAccess: access ? access.total : 0,
      totalOrder: order ? order.total : 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return mergedResults;
};

const statisticalPerformanceByQuarter = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  const cacheKey = `${startDate}:${endDate}:statisticalPerformanceByQuarter`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const accessPipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $lte: [{ $month: '$createdAt' }, 3] },
            'Q1',
            {
              $cond: [
                { $lte: [{ $month: '$createdAt' }, 6] },
                'Q2',
                {
                  $cond: [{ $lte: [{ $month: '$createdAt' }, 9] }, 'Q3', 'Q4'],
                },
              ],
            },
          ],
        },
        totalAccess: { $sum: '$total' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const ordersPipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $lte: [{ $month: '$createdAt' }, 3] },
            'Q1',
            {
              $cond: [
                { $lte: [{ $month: '$createdAt' }, 6] },
                'Q2',
                {
                  $cond: [{ $lte: [{ $month: '$createdAt' }, 9] }, 'Q3', 'Q4'],
                },
              ],
            },
          ],
        },
        totalOrder: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const accessByQuarter = await DailyAccess.aggregate(accessPipeline);
  const ordersByQuarter = await Order.aggregate(ordersPipeline);

  const allQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const result = mergeDataByQuarter(accessByQuarter, ordersByQuarter, allQuarters);

  cacheService.set(cacheKey, result);
  return result;
};

const mergeDataByQuarter = (accessData, orderData, allQuarters) => {
  const mergedResults = allQuarters.map((quarter) => {
    const access = accessData.find((a) => a._id === quarter)?.totalAccess || 0;
    const order = orderData.find((o) => o._id === quarter)?.totalOrder || 0;
    return {
      quarter,
      totalAccess: access,
      totalOrder: order,
    };
  });

  return mergedResults;
};

const statisticalPerformanceByYear = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  const cacheKey = `${startDate}:${endDate}:statisticalPerformanceByYear`;
  const resultCache = await cacheService.get(cacheKey);
  if (resultCache) return resultCache;

  const accessPipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalAccess: { $sum: '$total' },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ];

  const ordersPipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalOrder: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ];

  const accessByMonth = await DailyAccess.aggregate(accessPipeline);
  const ordersByMonth = await Order.aggregate(ordersPipeline);

  const result = mergeDataByMonth(accessByMonth, ordersByMonth, year);

  cacheService.set(cacheKey, result);
  return result;
};

const mergeDataByMonth = (accessData, orderData, year) => {
  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  const mergedResults = allMonths.map((month) => {
    const access = accessData.find((a) => a._id.month === month)?.totalAccess || 0;
    const order = orderData.find((o) => o._id.month === month)?.totalOrder || 0;
    return {
      month: `${year}-${String(month).padStart(2, '0')}`,
      totalAccess: access,
      totalOrder: order,
    };
  });

  return mergedResults;
};

module.exports = {
  statisticalRevenueByDay,
  statisticalRevenueByMonth,
  statisticalRevenueByQuarter,
  statisticalRevenueByYear,
  statisticalPerformanceByDay,
  statisticalPerformanceByMonth,
  statisticalPerformanceByQuarter,
  statisticalPerformanceByYear,
};
