const objectMapper = require('object-mapper');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid-v4');

const userSchema = require('../schemas/userSchema');

const generateArrayFromObject = require('../utils/common').generateArrayFromObject;
const validateRequiredFields = require('../utils/common').validateRequiredFields;
const encryptString = require('../utils/common').encryptString;

const createMap = {
  name: 'name',
  surname: 'surname',
  lastname: 'lastname',
  'address.int_number': 'contact_info.address.int_number',
  'address.ext_number': 'contact_info.address.ext_number',
  'address.neighborhood': 'contact_info.address.neighborhood',
  'address.zip_code': 'contact_info.address.zip_code',
  'address.city': 'contact_info.address.city',
  'address.country': 'contact_info.address.country',
  'phone_number.area_code': 'contact_info.phone_number.area_code',
  'phone_number.number': 'contact_info.phone_number.number',
  email: 'email',
  username: 'username',
  password: 'password',
  confirm_password: 'confirm_password',
  avatar: 'avatar',
};

const updateMap = {
  name: 'name',
  surname: 'surname',
  lastname: 'lastname',
  'address.int_number': 'contact_info.address.int_number',
  'address.ext_number': 'contact_info.address.ext_number',
  'address.neighborhood': 'contact_info.address.neighborhood',
  'address.zip_code': 'contact_info.address.zip_code',
  'address.city': 'contact_info.address.city',
  'address.country': 'contact_info.address.country',
  'phone_number.area_code': 'contact_info.phone_number.area_code',
  'phone_number.number': 'contact_info.phone_number.number',

  email: 'email',
  avatar: 'avatar',
};

const infoMap = {
  name: 'name',
  surname: 'surname',
  lastname: 'lastname',
  'contact_info.address.int_number': 'address.int_number',
  'contact_info.address.ext_number': 'address.ext_number',
  'contact_info.address.neighborhood': 'address.neighborhood',
  'contact_info.address.zip_code': 'address.zip_code',
  'contact_info.address.city': 'address.city',
  'contact_info.address.country': 'address.country',
  'contact_info.phone_number.area_code': 'phone_number.area_code',
  'contact_info.phone_number.number': 'phone_number.number',

  email: 'email',
  username: 'username',
  avatar: 'avatar',
};

const createRequiredFieldsList = 'name surname lastname contact_info.address.ext_number contact_info.address.neighborhood contact_info.address.zip_code contact_info.address.city contact_info.address.country contact_info.phone_number.area_code contact_info.phone_number.number email username password confirm_password'.split(' ');

userSchema.statics.createMap = body => (
  validateRequiredFields(objectMapper(body, createMap), createRequiredFieldsList)

  // validate password matching
  .then(createBody => (
    createBody.password === createBody.confirm_password ? Promise.resolve(createBody) : Promise.reject({
      statusCode: 400,
      code: 'Password missmatch',
    })
  ))

  // send back result from validations
  .then(createBody => (
    Promise.resolve(createBody)
  ))
);

userSchema.statics.updateMap = body => (
  Promise.resolve(objectMapper(body, updateMap))
);

userSchema.methods.getInfo = function getInfo() {
  const objTmp = objectMapper(this, infoMap);
  return objTmp;
};

userSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }

    return callback(null, isMatch);
  });
};

userSchema.methods.compareToken = function compareToken(candidateToken, callback) {
  if (this.token === candidateToken) {
    return callback(null, true);
  }

  return bcrypt.compare(candidateToken, this.token, (err, isMatch) => (
    callback(err, isMatch)
  ));
};

userSchema.statics.login = function login(query) {
  return new Promise((resolve, reject) => {
    this.findOne({
      username: query.username,
    }, (err, user) => {
      if (err || !user) {
        return reject({
          statusCode: 401,
          code: 'User not found',
        });
      }

      console.log(query, user);

      return user.comparePassword(query.password, (compareErr, isMatch) => {
        if (compareErr || !isMatch) {
          return reject({
            statusCode: 401,
            code: 'User and Password missmatch.',
          });
        }

        return resolve(user);
      });
    });
  });
};

userSchema.pre('save', function preSave(next) {
  this.search = generateArrayFromObject(this, 'email username'.split(' '));
  this.updated_at = Date.now();
  console.log(generateArrayFromObject(this, 'email username'.split(' ')), this.email, this.username);

  if (this.isNew) {
    return Promise.all([
      encryptString(this.password),
      encryptString(uuid()),
    ])

    .then((result) => {
      this.token = result[1];
      this.password = result[0];
      next();
    });
  }

  return next();
});

userSchema.index({
  _id: 1,
});

userSchema.index({
  email: 1,
});

userSchema.index({
  username: 1,
});

userSchema.index({
  email: 1,
  username: 1,
});

module.exports = mongoose.model('users', userSchema);
