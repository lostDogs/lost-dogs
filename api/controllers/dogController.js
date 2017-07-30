const CrudManager = require('./crudManager');
const Dog = require('../models/Dog');

const ErrorHander = require('../utils/errorHandler');

module.exports = () => {
  const crudManager = CrudManager(Dog);

  const create = (req, res) => {
    crudManager.create(req.body, (err, dog) => {
      if (err) {
        return ErrorHander.handle(err, res);
      }

      return res.status(201).json(dog);
    });
  };

  const update = (req, res) => {
    crudManager.update(req.body, req.params.id, (err, dog) => {
      if (err) {
        return ErrorHander.handle(err, res);
      }

      return res.json(dog);
    });
  };

  const retrieve = (req, res) => {
    crudManager.retrieve(req.params.id, (err, dog) => {
      if (err) {
        return ErrorHander.handle(err, res);
      }

      return res.json(dog);
    });
  };

  const deleteItem = (req, res) => {
    crudManager.deleteItem(req.params.id, (err) => {
      if (err) {
        return ErrorHander.handle(err, res);
      }

      return res.sendStatus(202);
    });
  };

  return {
    create,
    retrieve,
    update,
    deleteItem,
  };
};
