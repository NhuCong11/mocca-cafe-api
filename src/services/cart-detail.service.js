const httpStatus = require('http-status');

const { CartDetail } = require('../models');
const ApiError = require('../utils/ApiError');
const { cartDetailMessage } = require('../messages');

const getCartDetailById = async (cartDetailId) => {
  const cartDetail = await CartDetail.findById(cartDetailId);

  if (!cartDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, cartDetailMessage().NOT_FOUND);
  }

  return cartDetail;
};

const createCartDetail = async (cartDetailBody) => {
  const cartDetail = await CartDetail.create(cartDetailBody);
  return cartDetail;
};

const getCartDetailsByKeyword = async (query) => {
  const cartDetails = await CartDetail.find();
  return cartDetails;
};

const updateCartDetailById = async (cartDetailId, updateBody) => {
  const cartDetail = await getCartDetailById(cartDetailId);

  Object.assign(cartDetail, updateBody);
  await cartDetail.save();

  return cartDetail;
};

const deleteCartDetailById = async (cartDetailId) => {
  const cartDetail = await getCartDetailById(cartDetailId);

  await cartDetail.deleteOne();

  return cartDetail;
};

module.exports = {
  createCartDetail,
  getCartDetailById,
  updateCartDetailById,
  deleteCartDetailById,
  getCartDetailsByKeyword,
};
