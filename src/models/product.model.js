const mongoose = require('mongoose');

const { PRODUCT_IMAGE_DEFAULT } = require('../constants');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: PRODUCT_IMAGE_DEFAULT,
    },
    classifies: {
      type: [String],
      required: true,
      default: [],
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Product', productSchema);
