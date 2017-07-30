const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: String,
  surname: String,
  lastname: String,
  contact_info: {
    address: {
      int_number: String,
      ext_number: String,
      neighborhood: String,
      zip_code: String,
      city: String,
      country: String,
    },
    phone_number: {
      area_code: Number,
      number: Number,
    },
  },

  role: {
    type: String,
    enum: ['editor', 'admin', 'user'],
    default: 'user',
  },

  search: Array,

  email: String,
  username: String,
  password: String,
  token: String,

  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
