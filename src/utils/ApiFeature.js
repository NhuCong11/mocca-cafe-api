const { LIMIT_DEFAULT, PAGE_DEFAULT, SORT_DEFAULT_STRING } = require('../constants');

class ApiFeature {
  constructor(model) {
    this.model = model;
  }

  async getResults(query, fieldsRegex, fieldsExclude = ['password', '__v']) {
    const {
      limit = LIMIT_DEFAULT,
      page = PAGE_DEFAULT,
      keyword = '',
      sortBy = SORT_DEFAULT_STRING,
      ...queryObj
    } = query;

    const object = Object.fromEntries(
      Object.entries(queryObj).map(([key, value]) => {
        if (value === true || value === false) {
          return [key, value];
        }
        return [key, { $regex: new RegExp(value.toString().split(',')[0], 'i') }];
      }),
    );

    const objectFieldsExclude = {};
    fieldsExclude.forEach((field) => {
      const key = `paginatedResults.${field}`;
      objectFieldsExclude[key] = 0;
    });

    const skip = (page - 1) * limit;
    const sort = sortBy.split(',').map((sortItem) => {
      const [field, option = 'desc'] = sortItem.split(':');
      return { [field]: option === 'desc' ? -1 : 1 };
    });

    const sortObject = Object.assign(...sort);

    const aggregationPipeline = [
      {
        $match: {
          $or: Object.keys(object).length
            ? [object]
            : fieldsRegex.map((field) => ({ [field]: { $regex: new RegExp(keyword, 'i') } })),
        },
      },
      {
        $facet: {
          paginatedResults: [{ $sort: sortObject }, { $skip: skip }, { $limit: +limit }],
          totalCount: [{ $count: 'total' }],
        },
      },
      { $project: { paginatedResults: 1, totalCount: { $arrayElemAt: ['$totalCount.total', 0] } } },
      { $project: objectFieldsExclude },
    ];

    const [result] = await this.model.aggregate(aggregationPipeline);

    const detailResult = {
      limit: +limit,
      totalResult: result.totalCount || 0,
      totalPage: Math.ceil((result.totalCount || 0) / +limit),
      currentPage: +page,
      currentResult: result.paginatedResults.length,
    };

    return { results: result.paginatedResults, ...detailResult };
  }
}

module.exports = ApiFeature;
