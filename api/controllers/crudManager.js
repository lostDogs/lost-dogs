module.exports = (model) => {
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

  const create = (body, callback) => {
    model.createMap(body)
      .then(createBody => (
        model.create(createBody, (err, item) => {
          if (err) {
            return callback({
              statusCode: 500,
              code: 'Error while saving object.',
            });
          }

          return callback(null, item.getInfo());
        })
      ), err => (
        callback(err)
      ));
  };

  const update = (body, id, callback) => {
    model.updateMap(body)

      .then(updateBody => (
        model.findOneAndUpdate({ _id: id }, updateBody, (err, item) => {
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

          return retrieve(item.id, callback);
        })
      ), err => (
        callback(err)
      ));
  };

  const deleteItem = (id, callback) => {
    retrieve(id, (findErr) => {
      if (findErr) {
        return callback(findErr);
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
