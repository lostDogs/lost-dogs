const express = require('express');

const router = express.Router();

// clients controller
const controller = require('../controllers/userController')();

router.post('/', controller.create);
router.get('/:username', controller.retrieve);
router.put('/:username', controller.update);
router.delete('/:username', controller.deleteItem);

router.post('/login', controller.login);

module.exports = router;
