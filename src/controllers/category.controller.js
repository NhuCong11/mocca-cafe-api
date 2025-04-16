const httpStatus = require('http-status');

const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const { categoryMessage } = require('../messages');

const createCategory = catchAsync(async (req, res) => {
  if (req.file) req.body['image'] = req.file.path;

  const category = await categoryService.createCategory(req.body);

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, categoryMessage().CREATE_SUCCESS, category));
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategoriesByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, categoryMessage().FIND_LIST_SUCCESS, categories));
});

const getCategoryById = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.getCategoryById(categoryId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, categoryMessage().FIND_SUCCESS, category));
});

const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  if (req.file) req.body['image'] = req.file.path;

  const category = await categoryService.updateCategoryById(categoryId, req.body);

  res.status(httpStatus.OK).json(response(httpStatus.OK, categoryMessage().UPDATE_SUCCESS, category));
});

const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.deleteCategoryById(categoryId);

  res.status(httpStatus.OK).json(response(httpStatus.OK, categoryMessage().DELETE_SUCCESS, category));
});

const exportExcel = catchAsync(async (req, res) => {
  const wb = await categoryService.exportExcel(req.query);

  wb.writeToBuffer().then((buffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `categories-moccacafe-${Date.now()}.xlsx`);
    res.send(buffer);
  });
});

const importCategoriesFromExcelFile = catchAsync(async (req, res) => {
  const categories = await categoryService.importCategoriesFromExcelFile(req.file);
  res.status(httpStatus.OK).json(response(httpStatus.OK, categoryMessage().IMPORT_SUCCESS, categories));
});

module.exports = {
  exportExcel,
  getCategories,
  updateCategory,
  deleteCategory,
  createCategory,
  getCategoryById,
  importCategoriesFromExcelFile,
};
