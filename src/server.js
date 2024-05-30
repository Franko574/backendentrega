import express from 'express';
import morgan from 'morgan';
import { __dirname } from './path.js'
import { Server } from 'socket.io';
import { errorHandler } from './middlewares/errorHandler.js';
import handlebars from 'express-handlebars';

import viewsRouter from './routes/views.router.js';
import cartRouter from './routes/cart.router.js'
import productsRouter from './routes/products.router.js'; /* Revisar error SyntaxError: The requested module './routes/cart.router.js' does not provide an export named 'default' */
import ProductManager from './managers/product.manager.js'; 

/* Entrega 29.5----------------------------------------------------------------------- */
/* import { __dirname } from './utils.js'; */
/* Entrega 29.5----------------------------------------------------------------------- */

const productManager = new ProductManager(`${__dirname}/data/products.json`);
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'))

/* Entrega 29.5----------------------------------------------------------------------- */
app.engine('handlebars', handlebars.engine()); 
app.set('view engine', 'handlebars');  
app.set('views', __dirname+'/views');
/* Entrega 29.5----------------------------------------------------------------------- */  

app.use('/', viewsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productsRouter); /*  Revisar error */

/* Entrega 29.5----------------------------------------------------------------------- */
/* Entrega 29.5----------------------------------------------------------------------- */


app.use(errorHandler);

const httpServer = app.listen(8080, ()=>{
    console.log('Server listening on port 8080');
});

/* Entrega 29.5----------------------------------------------------------------------- */
const socketServer = new Server(httpServer);

socketServer.on('connection', async(socket)=>{
    console.log('🟢 ¡New connection!', socket.id);

    const products = await productManager.getProducts();  // Definir products aquí
    socketServer.emit('productos', products);
    console.log('productos enviados');

    
    socketServer.emit('productos', await productManager.getProducts());
    console.log('productos enviados')

    socket.on('disconnect', ()=>{
        console.log('🔴 User disconnect', socket.id);
    });

    socket.on('Nuevo producto', async (newProduct)=>{
        productManager.addNewProduct(newProduct);
        const products = await productManager.getProducts();
        socketServer.emit('productos', products);
    });

    socket.on('chat:message', async(id) => {
        await productManager.deleteProduct(id);
        console.log('Producto eliminado');
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    });

    socket.on('chat:typing', (username)=>{
        socket.broadcast.emit('chat:typing', username)
    });
    
    
})


/* Entrega 29.5----------------------------------------------------------------------- */