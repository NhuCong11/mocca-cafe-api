const slug = require('slug');
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre('save', function (next) {
  const category = this;

  if (category.isModified('name')) {
    category.slug = slug(category.name);
  }

  next();
});

module.exports = mongoose.model('Category', categorySchema);
