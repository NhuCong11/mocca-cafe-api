const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cartDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartDetail',
        required: true,
      },
    ],
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank', 'prepaid'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    address: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'canceled', 'confirmed', 'reject', 'shipping', 'success'],
      default: 'pending',
    },
    paymentCode: {
      type: String,
    },
    expriedTimeBank: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Order', orderSchema);
