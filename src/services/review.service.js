const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');

const { Review } = require('../models');
const ApiError = require('../utils/ApiError');
const { reviewMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');
const { STYLE_EXPORT_EXCEL, PAGE_DEFAULT, LIMIT_DEFAULT_EXPORT } = require('../constants');

const getReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, reviewMessage().NOT_FOUND);
  }

  return review;
};

const createReview = async (reviewBody) => {
  const newReview = await Review.create(reviewBody);
  return newReview;
};

const getReviewsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Review);

  const { results, ...detailResult } = await apiFeature.getResults(query, [
    'user',
    'product',
    'order',
    'rating',
    'isReview',
    'comment',
  ]);

  return { reviews: results, ...detailResult };
};

const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);

  Object.assign(review, updateBody);
  await review.save();

  return review;
};

const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);

  await review.deleteOne();

  return review;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Review);

  query.page = PAGE_DEFAULT;
  query.limit = LIMIT_DEFAULT_EXPORT;

  const { results } = await apiFeature.getResults(query, ['userId', 'productId', 'orderId', 'rating']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Reviews');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(40);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(25);
  ws.column(8).setWidth(40);
  ws.column(9).setWidth(40);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('USER_ID').style(headerStyle);
  ws.cell(1, 3).string('PRODUCT_ID').style(headerStyle);
  ws.cell(1, 4).string('ORDER_ID').style(headerStyle);
  ws.cell(1, 5).string('RATING').style(headerStyle);
  ws.cell(1, 6).string('IS_REVIEW').style(headerStyle);
  ws.cell(1, 7).string('COMMENT').style(headerStyle);
  ws.cell(1, 8).string('Last acctive').style(headerStyle);
  ws.cell(1, 9).string('Created At').style(headerStyle);

  results.forEach((review, index) => {
    ws.cell(index + 2, 1).string(review._id.toString());
    ws.cell(index + 2, 2).string(review.user.toString());
    ws.cell(index + 2, 3).string(review.product.toString());
    ws.cell(index + 2, 4).string(review.order.toString());
    ws.cell(index + 2, 5).number(review.rating);
    ws.cell(index + 2, 6).string(review.isReview.toString());
    ws.cell(index + 2, 7).string(review.comment);
    ws.cell(index + 2, 8).string(moment(review.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 9).string(moment(review.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

module.exports = {
  exportExcel,
  createReview,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  getReviewsByKeyword,
};
