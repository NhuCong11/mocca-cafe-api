const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { cartDetailService } = require('../services');
const { cartDetailMessage } = require('../messages');

const createCartDetail = catchAsync(async (req, res) => {
  const cartDetail = await cartDetailService.createCartDetail(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, cartDetailMessage().CREATE_SUCCESS, cartDetail));
});

const getCartDetails = catchAsync(async (req, res) => {
  const cartDetails = await cartDetailService.getCartDetailsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, cartDetailMessage().FIND_LIST_SUCCESS, cartDetails));
});

const getCartDetailById = catchAsync(async (req, res) => {
  const { cartDetailId } = req.params;

  const cartDetail = await cartDetailService.getCartDetailById(cartDetailId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartDetailMessage().FIND_SUCCESS, cartDetail));
});

const updateCartDetail = catchAsync(async (req, res) => {
  const { cartDetailId } = req.params;

  const cartDetail = await cartDetailService.updateCartDetailById(cartDetailId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartDetailMessage().UPDATE_SUCCESS, cartDetail));
});

const deleteCartDetail = catchAsync(async (req, res) => {
  const { cartDetailId } = req.params;

  const cartDetail = await cartDetailService.deleteCartDetailById(cartDetailId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, cartDetailMessage().DELETE_SUCCESS, cartDetail));
});

module.exports = {
  getCartDetails,
  createCartDetail,
  updateCartDetail,
  deleteCartDetail,
  getCartDetailById,
};
