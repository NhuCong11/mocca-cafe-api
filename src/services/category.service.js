const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');
const excelToJson = require('convert-excel-to-json');

const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { categoryMessage } = require('../messages');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');
const generateUniqueSlug = require('../utils/generateUniqueSlug');
const { STYLE_EXPORT_EXCEL, PAGE_DEFAULT, LIMIT_DEFAULT_EXPORT } = require('../constants');

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, categoryMessage().NOT_FOUND);
  }

  return category;
};

const createCategory = async (categoryBody) => {
  const { name } = categoryBody;

  const category = await Category.findOne({ name });

  if (category) {
    throw new ApiError(httpStatus.BAD_REQUEST, categoryMessage().ALREADY_EXISTS);
  }

  const newCategory = await Category.create(categoryBody);

  return newCategory;
};

const getCategoriesByKeyword = async (query) => {
  const key = objectToString(query);

  const categoriesCache = cacheService.get(`${key}:categories`);

  if (categoriesCache) {
    return categoriesCache;
  }

  const apiFeature = new ApiFeature(Category);

  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'slug']);

  const result = { categories: results, ...detailResult };

  cacheService.set(`${key}:categories`, result);

  return result;
};

const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);

  if (updateBody.name && category.name.toLowerCase() !== updateBody.name?.toLowerCase()) {
    updateBody['slug'] = await generateUniqueSlug(category.name, Category);
  }

  Object.assign(category, updateBody);
  await category.save();

  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  await category.deleteOne();

  return category;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Category);

  query.page = PAGE_DEFAULT;
  query.limit = LIMIT_DEFAULT_EXPORT;

  const { results } = await apiFeature.getResults(query, ['name', 'slug']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Categories');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(25);
  ws.column(5).setWidth(25);
  ws.column(6).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Name').style(headerStyle);
  ws.cell(1, 3).string('Image').style(headerStyle);
  ws.cell(1, 4).string('Slug').style(headerStyle);
  ws.cell(1, 5).string('Last acctive').style(headerStyle);
  ws.cell(1, 6).string('Created At').style(headerStyle);

  results.forEach((category, index) => {
    ws.cell(index + 2, 1).string(category._id.toString());
    ws.cell(index + 2, 2).string(category.name);
    ws.cell(index + 2, 3).string(category.image);
    ws.cell(index + 2, 4).string(category.slug);
    ws.cell(index + 2, 5).string(moment(category.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 6).string(moment(category.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

const importCategoriesFromExcelFile = async (file) => {
  const fileBuffer = file.buffer;

  let categories = [];
  const result = excelToJson({ source: fileBuffer });

  const rows = result[Object.keys(result)[0]];

  rows.shift();

  for (let row of rows) {
    categories.push({
      name: row['B'],
      image: row['C'],
    });
  }

  await Category.insertMany(categories);
  return categories;
};

module.exports = {
  exportExcel,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoriesByKeyword,
  importCategoriesFromExcelFile,
};
