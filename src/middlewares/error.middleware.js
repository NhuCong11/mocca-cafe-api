const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { env, logger } = require('../config');
const ApiError = require('../utils/ApiError');
const { errorHistoryService } = require('../services');
const getInfoClient = require('../utils/getInfoClient');
const { systemMessage, authMessage } = require('../messages');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  switch (error.message) {
    case 'jwt expired':
      error = new ApiError(httpStatus.UNAUTHORIZED, authMessage().JWT_EXPIRED);
      break;
    case 'File too large':
      error = new ApiError(httpStatus.BAD_REQUEST, systemMessage().IMAGE_MAX_SIZE);
      break;
    case 'invalid signature':
      error = new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
      break;
    case 'jwt malformed':
      error = new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
      break;
    case 'invalid token':
      error = new ApiError(httpStatus.BAD_REQUEST, authMessage().INVALID_TOKEN);
      break;
    default:
      break;
  }

  next(error);
};

const errorHandler = async (err, req, res, next) => {
  let { statusCode, message } = err;

  if (env.nodeEnv === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    const { userIP } = getInfoClient(req);

    await errorHistoryService.createErrorHistory({
      ip: userIP,
      path: req.path,
      stack: err.stack,
      method: req.method,
      message: err.message,
    });
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  };

  if (env.nodeEnv === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorHandler,
  errorConverter,
};
