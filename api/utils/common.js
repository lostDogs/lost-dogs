'use strict';

function clone(object) {
  const string = JSON.stringify(object);
  if (typeof string !== 'undefined') {
    return (JSON.parse(string));
  }

  return null;
}

function select(object, selector) {
  const path = selector.split('.');
  let obj = clone(object);

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
