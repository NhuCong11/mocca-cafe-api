const cors = require('cors');
const xss = require('xss-clean');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const apiRoute = require('./routes/api');
const { userService } = require('./services');
const baseRouter = require('./routes/base.route');
const { app, server } = require('./sockets/socket');
const initLogDirFile = require('./utils/initLogDirFile');
const limiter = require('./middlewares/rate-limit.middleware');
const countAccess = require('./middlewares/count-access.middleware');
const { env, mongo, logger, morgan, i18nService } = require('./config');
const { logUnauthenticatedRequest } = require('./middlewares/logger.middleware');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');

app.set('trust proxy', 1);
app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use(limiter());

app.use(express.json());
app.use(cookieParser());

app.use(xss());
app.use(mongoSanitize());

app.use(compression());

app.use(cors());

app.use((req, res, next) => {
  next(i18nService.setLocale(req, res));
});

if (env.nodeEnv !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

if (env.nodeEnv === 'development') {
  mongoose.set('debug', true);
}

app.use(countAccess);
app.use(logUnauthenticatedRequest);

app.use('/v1', apiRoute);
app.use('/', baseRouter);

app.use(errorConverter);
app.use(errorHandler);

try {
  initLogDirFile();
  logger.info('Log directory created...');
} catch (error) {
  logger.error(error);
}

mongoose
  .connect(mongo.uri)
  .then(() => logger.info('MongoDB connected...'))
  .then(() => {
    userService.createAdmin();
    logger.info('Admin created...');
  })
  .then(() =>
    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    }),
  )
  .catch((err) => logger.error(err));
