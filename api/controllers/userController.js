const CrudManager = require('./crudManager');
const User = require('../models/User');

const ErrorHander = require('../utils/errorHandler');
const token = require('../utils/token');

module.exports = () => {
  const crudManager = CrudManager(User);

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

  const login = (req, res) => {
    User.login(req.body)

      .then(user => (
        token.signToken({
          username: user.username,
          timestamp: Date.now(),
          token: user.token,
        })

        .then(userToken => (
          res.json(Object.assign(user.getInfo(), { token: userToken }))
        ))
      ))

      .catch(err => (
        ErrorHander.handle(err, res)
      ));
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
    login,
  };
};
