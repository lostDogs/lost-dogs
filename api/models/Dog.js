const objectMapper = require('object-mapper');
const mongoose = require('mongoose');
const moment = require('moment');

const dogSchema = require('../schemas/dogSchema');

const generateArrayFromObject = require('../utils/common').generateArrayFromObject;

const createMap = {
  name: 'name',
  kind: 'kind',
  description: 'description',
  found_date: 'found_date',
  reporter_id: 'reporter_id',
};

const infoMap = {
  name: 'name',
  kind: 'kind',
  description: 'description',
  found_date: 'found_date',
  reporter_id: 'reporter_id',
  created_at: 'created_at',
  _id: '_id',
};

dogSchema.statics.createMap = (body) => {
  const objTmp = objectMapper(body, createMap);

  objTmp.found_date = moment(objTmp.found_date, 'YYYY-MM-DD HH:mm').toDate();

  console.log(objTmp, body);

  return objTmp;
};

dogSchema.statics.updateMap = (body) => {
  const objTmp = objectMapper(body, createMap);

  objTmp.found_date = moment(objTmp.found_date, 'YYYY-MM-DD HH:mm').toDate();

  console.log(objTmp);

  return objTmp;
};

dogSchema.methods.getInfo = function getInfo() {
  const objTmp = objectMapper(this, infoMap);
  return objTmp;
};

dogSchema.pre('save', (next) => {
  this.search = generateArrayFromObject(this, 'kind name'.split(' '));
  this.updated_at = Date.now();

  next();
});

dogSchema.index({
  _id: 1,
});

dogSchema.index({
  name: 1,
});

dogSchema.index({
  reporter_id: 1,
});

module.exports = mongoose.model('dogs', dogSchema);
