const express = require('express'); 
const {createServer} = require('http');
const {Server} = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');  

const app = express(); 
const httpServer = createServer(app);
const io = new Server(httpServer); 

const ProductManager = require('./services/ProductManager');
const productManager = new ProductManager('./src/data/products.json');  

app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));  

const viewsRouter = require('./routers/views.rutas'); 
const cartRouters = require('./routers/carts.rutas');   
const createProductsRouter = require('./routers/products.rutas'); 

app.use('/', viewsRouter);
app.use('/api/carts', cartRouters); 
app.use('/api/products', createProductsRouter(io)); 

io.on('connection', async socket => {
    console.log('Cliente conectado'); 
    const products = await productManager.getProducts();
    socket.emit('update-products', products);

    socket.on('new-product', async (productData) => {
        await productManager.addProduct(productData);
        const updatedProducts = await productManager.getProducts();
        io.emit('update-products', updatedProducts);
    });

    socket.on('delete-product', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProducts();
        io.emit('update-products', updatedProducts);
    });
}); 

const PORT = 8080; 
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});






