const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');
const excelToJson = require('convert-excel-to-json');

const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');
const { productMessage, authMessage } = require('../messages');
const generateUniqueSlug = require('../utils/generateUniqueSlug');
const {
  STYLE_EXPORT_EXCEL,
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT_DEFAULT_STRING,
  LIMIT_DEFAULT_EXPORT,
} = require('../constants');

const updateAllSlugProducts = async () => {
  const products = await Product.find({});
  const productUpdated = [];

  for (let product of products) {
    product.slug = await generateUniqueSlug(product.name, Product);
    await product.save();
    productUpdated.push(product);
  }

  return productUpdated;
};

const updateAllPriceProducts = async () => {
  const products = await Product.find({ price: { $lt: 1000 } });

  for (let product of products) {
    product.price = product.price * 100;
    await product.save();
  }

  return products;
};

const createProduct = async (productBody) => {
  productBody['slug'] = await generateUniqueSlug(productBody.name, Product);

  if (productBody.classifies && typeof productBody.classifies === 'string') {
    productBody.classifies = productBody.classifies.split(',').map((c) => c.trim());
  } else if (Array.isArray(productBody.classifies)) {
    productBody.classifies = productBody.classifies.map((c) => c.toString());
  }

  const product = await Product.create(productBody);
  return product;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .select('name description image price slug classifies shop category')
    .populate([
      {
        path: 'shop',
        select: 'fullname email phone description address avatar background slug',
      },
      {
        path: 'category',
        select: 'name slug image',
      },
    ]);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, productMessage().NOT_FOUND);
  }

  return product;
};

const getProductsByKeyword = async (requestQuery) => {
  const key = objectToString(requestQuery);

  const productsCache = cacheService.get(key);

  if (productsCache) return productsCache;

  const {
    limit = LIMIT_DEFAULT,
    page = PAGE_DEFAULT,
    keyword = '',
    sortBy = SORT_DEFAULT_STRING,
    shop,
    category,
    minPrice,
    maxPrice,
  } = requestQuery;

  const sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return { [field]: option === 'desc' ? -1 : 1 };
  });

  const sortObject = Object.assign(...sort);

  const query = {};

  // Add keyword search condition if keyword is provided
  if (keyword && keyword.trim() !== '') {
    query.$and = [
      {
        $or: [
          { name: { $regex: new RegExp(keyword, 'i') } },
          { slug: { $regex: new RegExp(keyword, 'i') } },
          { description: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
      { deletedAt: null }, // Ensure we only get non-deleted products
    ];
  }

  // Add shop filter if provided
  if (shop) {
    if (!query.$and) query.$and = [];
    query.$and.push({ shop });
  }

  // Add category filter if provided
  if (category) {
    if (!query.$and) query.$and = [];
    query.$and.push({ category });
  }

  // Add price range filter if provided
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter = {};

    if (minPrice !== undefined) {
      priceFilter.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      priceFilter.$lte = Number(maxPrice);
    }

    if (Object.keys(priceFilter).length > 0) {
      if (!query.$and) query.$and = [];
      query.$and.push({ price: priceFilter });
    }
  }

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const products = await Product.find(query)
    .select('name description image price slug classifies shop category')
    .populate([
      {
        path: 'shop',
        select: 'fullname email phone description address avatar background slug',
        options: { lean: true },
      },
      {
        path: 'category',
        select: 'name slug image',
        options: { lean: true },
      },
    ])
    .skip(skip)
    .limit(limit)
    .sort(sortObject)
    .lean();

  const totalSearch = await Product.countDocuments(query);

  const cleanProducts = products.filter(Boolean);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: cleanProducts.length,
  };

  const results = { products: cleanProducts, ...detailResult };

  cacheService.set(key, results);

  return results;
};

const getMyProducts = async (query, shop) => {
  const apiFeature = new ApiFeature(Product);

  query.shop = shop;

  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description']);

  return { products: results, ...detailResult };
};

const updateProductById = async (productId, updateBody, shop) => {
  const product = await getProductById(productId);

  if (product.shop._id.toString() !== shop) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }

  if (updateBody.name && product.name.toLowerCase() !== updateBody.name?.toLowerCase()) {
    updateBody['slug'] = await generateUniqueSlug(updateBody.name, Product);
  }

  if (updateBody.classifies && typeof updateBody.classifies === 'string') {
    updateBody.classifies = updateBody.classifies.split(',').map((c) => c.trim());
  } else if (Array.isArray(updateBody.classifies)) {
    updateBody.classifies = updateBody.classifies.map((c) => c.toString());
  }

  Object.assign(product, updateBody);
  await product.save();

  cacheService.del('{"limit":10,"page":1}');

  return product;
};

const deleteProductById = async (productId, shop) => {
  const product = await getProductById(productId);

  if (product.shop._id.toString() !== shop) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }

  // await product.deleteOne();
  product.deletedAt = new Date();
  await product.save();

  cacheService.del('{"limit":10,"page":1}');

  return product;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Product);

  query.page = PAGE_DEFAULT;
  query.limit = LIMIT_DEFAULT_EXPORT;

  const { results } = await apiFeature.getResults(query, ['name', 'slug', 'price']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Products');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(40);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(25);
  ws.column(8).setWidth(25);
  ws.column(9).setWidth(25);
  ws.column(10).setWidth(25);
  ws.column(11).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Name').style(headerStyle);
  ws.cell(1, 3).string('Slug').style(headerStyle);
  ws.cell(1, 4).string('Description').style(headerStyle);
  ws.cell(1, 5).string('Price').style(headerStyle);
  ws.cell(1, 6).string('Image').style(headerStyle);
  ws.cell(1, 7).string('Classifies').style(headerStyle);
  ws.cell(1, 8).string('ShopId').style(headerStyle);
  ws.cell(1, 9).string('CategoryId').style(headerStyle);
  ws.cell(1, 10).string('Last acctive').style(headerStyle);
  ws.cell(1, 11).string('Created At').style(headerStyle);

  results.forEach((product, index) => {
    ws.cell(index + 2, 1).string(product._id.toString());
    ws.cell(index + 2, 2).string(product.name);
    ws.cell(index + 2, 3).string(product.slug);
    ws.cell(index + 2, 4).string(product.description);
    ws.cell(index + 2, 5).string(product.price.toString() + ' VND');
    ws.cell(index + 2, 6).string(product.image);
    ws.cell(index + 2, 7).string(product.classifies.join(', '));
    ws.cell(index + 2, 8).string(product.shop.toString());
    ws.cell(index + 2, 9).string(product.category.toString());
    ws.cell(index + 2, 10).string(moment(product.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 11).string(moment(product.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

const importProductsFromExcelFile = async (file) => {
  const fileBuffer = file.buffer;

  let products = [];
  const result = excelToJson({ source: fileBuffer });

  const rows = result[Object.keys(result)[0]];

  rows.shift();

  for (let row of rows) {
    products.push({
      name: row['A'],
      description: row['B'],
      price: row['C'],
      image: row['D'],
      category: row['E'],
      shop: row['F'],
    });
  }

  await Product.insertMany(products);
  return products;
};

module.exports = {
  exportExcel,
  createProduct,
  getMyProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductsByKeyword,
  importProductsFromExcelFile,
  updateAllSlugProducts,
  updateAllPriceProducts,
};
