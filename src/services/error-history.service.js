const { ErrorHistory } = require('../models');

const createErrorHistory = async (errorHistoryBody) => {
  const errorHistory = await ErrorHistory.create(errorHistoryBody);
  return errorHistory;
};

module.exports = {
  createErrorHistory,
};
