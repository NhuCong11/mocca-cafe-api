const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Contact', contactSchema);
