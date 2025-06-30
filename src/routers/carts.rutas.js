const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controllers');

router.post('/', controller.create);
router.get('/:cid', controller.getById);
router.post('/:cid/products/:pid', controller.addProduct);

module.exports = router