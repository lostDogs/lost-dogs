const express = require('express');

const router = express.Router();

// clients controller
const controller = require('../controllers/dogController')();

router.post('/', controller.create);
router.get('/:id', controller.retrieve);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleteItem);

module.exports = router;
