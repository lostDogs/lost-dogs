const express = require('express');

const router = express.Router();

// clients controller
const controller = require('../controllers/userController')();

router.post('/', controller.create);
router.get('/:id', controller.retrieve);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleteItem);

router.post('/login', controller.login);

module.exports = router;
