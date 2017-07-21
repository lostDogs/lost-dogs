'use strict';

const bcrypt = require('bcrypt-nodejs');

function select(object, selector) {
  if (object[selector]) return object[selector];

  const path = selector.split('.');
  let obj = Object.assign({}, object);

  for (let i = 0; i < path.length; i += 1) {
    if (obj[path[i]]) {
      obj = obj[path[i]];
    } else return null;
  }

  return obj;
}

module.exports.generateArrayFromObject = (object, fields) => {
  const result = [];

  fields.forEach((field) => {
    if (select(object, field)) {
      result.push(String(select(object, field)).toLowerCase());
    }
  });

  return result;
};

module.exports.encryptString = string => (
  new Promise((resolve, reject) => (
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(string, salt, null, (hashErr, hash) => (
        hashErr ? reject(hashErr) : resolve(hash)
      ));
    })
  ))
);

module.exports.validateRequiredFields = (object, requiredFieldsList) => {
  const missingFields = requiredFieldsList.filter(requiredField => (!select(object, requiredField)));

  if (missingFields.length > 0) {
    return Promise.reject({
      statusCode: 400,
      code: `Missing fields in create request: ${missingFields.join(', ')}`,
    });
  }

  return Promise.resolve(object);
};
