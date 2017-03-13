const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: String,
  kind: String,
  description: String,
  found_date: {
    type: Date,
    default: Date.now,
  },

  search: Array,

  // reporter_id: mongoose.Schema.Types.ObjectId,

  // doc managment
  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});
