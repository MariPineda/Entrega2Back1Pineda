const express = require ('express');
const ProductManager = require ('../services/ProductManager'); 
const router = express.Router(); 
const path = require('path');
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'));

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

module.exports = router
