import { Router } from "express";
import { products } from '../server.js'; 
import ProductManager from "../managers/product.manager.js";

const router = Router();
const productManager = new ProductManager(`${__dirname}/data/products.json`);

router.get('/', (req, res) => {
    res.render('home', {products});
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
});

export default router; 

