const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { User, Product, Category } = require('../models');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');
const { shopMessage, categoryMessage } = require('../messages');
const { RATING_RANGE, LIMIT_DEFAULT, PAGE_DEFAULT } = require('../constants');

const randomRating = () => {
  const randomIndex = Math.floor(Math.random() * RATING_RANGE.length);
  return RATING_RANGE[randomIndex];
};

const getShops = async (requestQuery) => {
  const key = objectToString(requestQuery);

  const shopsCache = cacheService.get(`${key}:shops`);

  if (shopsCache) return shopsCache;

  const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT, keyword = '' } = requestQuery;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const query = {
    $and: [
      { role: 'shop' },
      {
        $or: [
          { phone: { $regex: new RegExp(keyword, 'i') } },
          { address: { $regex: new RegExp(keyword, 'i') } },
          { fullname: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
    ],
  };

  let shops = await User.find(query)
    .select('fullname email phone address avatar background description slug')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalSearch = await User.countDocuments(query);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: shops.length,
  };

  shops = shops.map((shop) => ({
    ...shop._doc,
    rating: randomRating(),
  }));

  const results = { shops, ...detailResult };

  cacheService.set(`${key}:shops`, results);

  return results;
};

const getDetailShop = async (id, selectProduct = true) => {
  const shopsCache = cacheService.get(`${id}:shopDetail`);

  if (shopsCache) return shopsCache;

  const shop = await User.findOne({
    _id: id,
    role: 'shop',
  }).select('fullname email phone address avatar background description slug');

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, shopMessage().NOT_FOUND);
  }

  if (!selectProduct) return shop;

  const products = await Product.find({ shop: id }).select('name description image price slug classifies');

  const results = { shop: { ...shop.toObject(), rating: randomRating(), products } };

  cacheService.set(`${id}:shopDetail`, results);

  return results;
};

const getShopDetailByIdAndGroupByCategory = async (id) => {
  const shopsCache = cacheService.get(`${id}:shopDetailGroup`);

  if (shopsCache) return shopsCache;

  const shop = await User.findOne({
    _id: id,
    role: 'shop',
  }).select('fullname email phone address avatar background description slug');

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, shopMessage().NOT_FOUND);
  }

  const products = await Product.find({ shop: id }).select('name description image price slug category classifies');

  const categoryIds = [...new Set(products.map((product) => product.category.toString()))];

  const categories = await Category.find({ _id: { $in: categoryIds } }).select('name slug image');

  const categoriesZ = [];

  categories.forEach((category) => {
    categoriesZ.push({ ...category.toObject(), products: [] });
  });

  products.forEach((product) => {
    const categoryIndex = categoriesZ.findIndex((category) => category._id.toString() === product.category.toString());
    const { category, ...productWithoutCategory } = product.toObject();
    if (categoryIndex !== -1) {
      categoriesZ[categoryIndex].products.push(productWithoutCategory);
    }
  });

  const results = {
    shop: { ...shop.toObject(), rating: randomRating(), categories: categoriesZ },
  };

  cacheService.set(`${id}:shopDetailGroup`, results);

  return results;
};

const searchRestaurants = async (requestQuery) => {
  const { keyword = '' } = requestQuery;

  const searchRestaurantsCache = cacheService.get(`${keyword}:searchRestaurants`);

  if (searchRestaurantsCache) return searchRestaurantsCache;

  const queryShop = {
    $and: [
      { role: 'shop' },
      {
        $or: [
          { phone: { $regex: new RegExp(keyword, 'i') } },
          { address: { $regex: new RegExp(keyword, 'i') } },
          { fullname: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
    ],
  };

  const queryProduct = {
    $or: [
      { name: { $regex: new RegExp(keyword, 'i') } },
      { slug: { $regex: new RegExp(keyword, 'i') } },
      { description: { $regex: new RegExp(keyword, 'i') } },
    ],
  };

  const [shops, products] = await Promise.all([
    User.find(queryShop).limit(8).select('fullname email phone address avatar background description slug'),
    Product.find(queryProduct).limit(9).select('name description image price slug classifies'),
  ]);

  const results = { shops, products };

  cacheService.set(`${keyword}:searchRestaurants`, results);

  return results;
};

const getShopsByCategory = async (requestQuery, categoryId) => {
  const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = requestQuery;

  const categoryCache = cacheService.get(`${categoryId}:${limit}:${page}:category`);

  if (categoryCache) return categoryCache;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const category = await Category.findById(categoryId).select('name slug image');

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, categoryMessage().NOT_FOUND);
  }

  const products = await Product.find({ category: categoryId }).limit(+limit).skip(skip).select('shop');

  const shopIds = [...new Set(products.map((product) => product.shop.toString()))];

  const shops = await Promise.all(shopIds.map((shopId) => getDetailShop(shopId, false)));

  const detailResult = {
    limit: +limit,
    totalResult: shopIds.length,
    totalPage: Math.ceil(shopIds.length / +limit),
    currentPage: +page,
    currentResult: shops.length,
  };

  const results = { category, shops: shops, ...detailResult };

  cacheService.set(`${categoryId}:${limit}:${page}:category`, results);

  return results;
};

module.exports = {
  getShops,
  getDetailShop,
  searchRestaurants,
  getShopsByCategory,
  getShopDetailByIdAndGroupByCategory,
};
