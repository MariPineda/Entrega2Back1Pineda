const path = require('path');
const ProductManager = require('../services/ProductManager');
const manager = new ProductManager(path.join(__dirname, '../data/products.json'));

module.exports = {
    getAll: async (req, res) => {
        const result = await manager.getProducts();
        res.json(result);
    },

    getById: async (req, res) => {
        const result = await manager.getProductById(req.params.pid);
        result ? res.json(result) : res.status(404).send('Producto no encontrado');
    },

    create: async (req, res, io) => {
        try {
            const product = await manager.addProduct(req.body);
            const products = await manager.getProducts();
            if (io) io.emit('update-products', products);
            res.status(201).json(product);
        } catch (err) {
            res.status(500).json({ error: 'Error al agregar producto' });
        }
    },

    update: async (req, res, io) => {
        const result = await manager.updatedProduct(req.params.pid, req.body);
        const products = await manager.getProducts();
        if (result) {   
            if (io) io.emit('update-products', products);
            res.json(result);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    },

    delete: async (req, res, io) => {
        const result = await manager.deleteProduct(req.params.pid);
        const products = await manager.getProducts();
        if (result) {
            if (io) io.emit('update-products', products);
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    }
};
