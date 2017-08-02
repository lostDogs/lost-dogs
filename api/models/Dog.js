const objectMapper = require('object-mapper');
const mongoose = require('mongoose');
const moment = require('moment');

const dogSchema = require('../schemas/dogSchema');

const generateArrayFromObject = require('../utils/common').generateArrayFromObject;
const validateRequiredFields = require('../utils/common').validateRequiredFields;

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

const createRequiredFieldsList = 'name kind found_date reporter_id'.split(' ');

dogSchema.statics.createMap = body => (
  validateRequiredFields(objectMapper(body, createMap), createRequiredFieldsList)

  .then(createBody => (
    Promise.resolve(Object.assign(createBody, {
      found_date: moment(createBody.found_date, 'YYYY-MM-DD HH:mm').toDate(),
    }))
  ))
);

dogSchema.statics.updateMap = (body) => {
  const updateBody = objectMapper(body, createMap);
  return Promise.resolve(Object.assign(updateBody, {
    found_date: updateBody.found_date ? moment(updateBody.found_date, 'YYYY-MM-DD HH:mm').toDate() : null,
  }));
};

dogSchema.methods.getInfo = function getInfo() {
  const objTmp = objectMapper(this, infoMap);
  return objTmp;
};

dogSchema.pre('save', function preSave(next) {
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
