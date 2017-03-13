module.exports = (model) => {
  const create = (body, callback) => {
    model.create(model.createMap(body), (err, item) => {
      if (err) {
        return callback({
          statusCode: 500,
          code: 'Error while saving object.',
        });
      }

      return callback(null, item.getInfo());
    });
  };

  const update = (updateBody, id, callback) => {
    model.findOneAndUpdate({ _id: id }, model.updateMap(updateBody), (err, item) => {
      if (err) {
        return callback({
          statusCode: 500,
          code: 'Error while updating object.',
        });
      } else if (!item) {
        return callback({
          statusCode: 404,
          code: 'Not found.',
        });
      }

      model.findById(id, (findErr, findItem) => {
        if (findErr) {
          return callback({
            statusCode: 500,
            code: 'Error while retrieving object.',
          });
        } else if (!findItem) {
          return callback({
            statusCode: 404,
            code: 'Not found.',
          });
        }

        return callback(null, findItem.getInfo());
      });
    });
  };

  const retrieve = (id, callback) => {
    model.findById(id, (err, item) => {
      if (err) {
        return callback({
          statusCode: 500,
          code: 'Error while retrieving object.',
        });
      } else if (!item) {
        return callback({
          statusCode: 404,
          code: 'Not found.',
        });
      }

      return callback(null, item.getInfo());
    });
  };

  const deleteItem = (id, callback) => {
    model.findById(id, (findErr, found) => {
      console.log(found);

      if (findErr) {
        return callback({
          statusCode: 500,
          code: 'Error while deleting object.',
        });
      } else if (!found) {
        return callback({
          statusCode: 404,
          code: 'Not found.',
        });
      }

      return model.remove({ _id: id }, (err, result) => {
        if (err) {
          return callback({
            statusCode: 500,
            code: 'Error while deleting object.',
          });
        }

        return callback(null, result);
      });
    });
  };

  return {
    create,
    retrieve,
    update,
    deleteItem,
  };
};
