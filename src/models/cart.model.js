const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    cartDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartDetail',
        default: [],
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Cart', cartSchema);
