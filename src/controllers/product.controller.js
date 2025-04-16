const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { productMessage } = require('../messages');
const { REQUEST_USER_KEY } = require('../constants');

const updateAllSlugProducts = catchAsync(async (req, res) => {
  const products = await productService.updateAllSlugProducts();
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().UPDATE_SUCCESS, products));
});

const updateAllPriceProducts = catchAsync(async (req, res) => {
  const products = await productService.updateAllPriceProducts();
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().UPDATE_SUCCESS, products));
});

const createProduct = catchAsync(async (req, res) => {
  req.body.shop = req[REQUEST_USER_KEY].id;

  if (req.file) req.body['image'] = req.file.path;

  if (req.body.classifies) {
    if (typeof req.body.classifies === 'string') {
      req.body.classifies = req.body.classifies.split(',').map((c) => c.trim());
    } else {
      req.body.classifies = JSON.parse(req.body.classifies);
    }
  }

  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, productMessage().CREATE_SUCCESS, product));
});

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProductsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

const getProductById = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await productService.getProductById(productId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_SUCCESS, product));
});

const getMyProducts = catchAsync(async (req, res) => {
  const shop = req[REQUEST_USER_KEY].id;

  const products = await productService.getMyProducts(req.query, shop);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().FIND_LIST_SUCCESS, products));
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const shop = req[REQUEST_USER_KEY].id;

  if (req.file) req.body['image'] = req.file.path;

  if (req.body.classifies) {
    if (typeof req.body.classifies === 'string') {
      req.body.classifies = req.body.classifies.split(',').map((c) => c.trim());
    } else {
      req.body.classifies = JSON.parse(req.body.classifies);
    }
  }

  const product = await productService.updateProductById(productId, req.body, shop);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().UPDATE_SUCCESS, product));
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const shop = req[REQUEST_USER_KEY].id;

  const result = await productService.deleteProductById(productId, shop);

  res.status(httpStatus.OK).json(response(httpStatus.OK, productMessage().DELETE_SUCCESS, result));
});

const exportExcel = catchAsync(async (req, res) => {
  const wb = await productService.exportExcel(req.query);

  wb.writeToBuffer().then((buffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `products-moccacafe-${Date.now()}.xlsx`);
    res.send(buffer);
  });
});

const importProductsFromExcelFile = catchAsync(async (req, res) => {
  const products = await productService.importProductsFromExcelFile(req.file);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Import success', products));
});

module.exports = {
  getProducts,
  exportExcel,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  importProductsFromExcelFile,
  updateAllSlugProducts,
  updateAllPriceProducts,
};
