const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: String,
  kind_Id: String,
  description: String,
  found_date: {
    type: Date,
    default: Date.now,
  },
  location: {
    address: String,
    latLong: {lat: Number, lng: Number}
  },
  male: Boolean,
  size_Id: String,
  color: String,
  pattern_Id: String,
  accessories_Id: [String],
  lost: Boolean,
  reward: Boolean,

  search: Array,

  reporter_id: mongoose.Schema.Types.ObjectId,

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
  // accesories_Id es un parametro que puede no existir, al igual que 'name' y 'description'
// este mapeo con la DB o con que? 
//Necesito modifcar la DB tmb?
module.exports.dogMappings = {
  createMap: {
    name: 'name',
    kind_Id: 'kind_Id',
    description: 'description',
    location: 'location',
    found_date: 'found_date',
    male: 'male',
    size_Id: 'size_Id',
    pattern_Id: 'pattern_Id',
    color: 'color',
    accessories_Id: 'accessories_Id',
    lost: 'lost',
    reward: 'reward',
    reporter_id: 'reporter_id',
  },

  infoMap: {
    name: 'name',
    kind_Id: 'kind_Id',
    description: 'description',
    location: 'location',
    found_date: 'found_date',
    male: 'male',
    size_Id: 'size_Id',
    pattern_Id: 'pattern_Id',
    color: 'color',
    accessories_Id: 'accessories_Id',
    lost: 'lost',
    reward: 'reward',    
    reporter_id: 'reporter_id',
    created_at: 'created_at',
    _id: '_id',
  },

  createRequiredFieldsList: 'kind_id location found_date male size_Id pattern_Id color lost reward reporter_id'.split(' '),
};
