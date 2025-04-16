const mongoose = require('mongoose');

const errorHistorySchema = mongoose.Schema({
  ip: {
    type: String,
  },
  path: {
    type: String,
  },
  method: {
    type: String,
  },
  message: {
    type: String,
  },
  stack: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ErrorHistory', errorHistorySchema);
