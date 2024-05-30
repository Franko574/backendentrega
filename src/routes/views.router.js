import { Router } from "express";
import { __dirname } from "../path.js"; 
import ProductManager from "../managers/product.manager.js";

const router = Router();

const productManager = new ProductManager(`${__dirname}/db/products.json`);

router.get("/", async (req, res) => {
    try {
      const { limit } = req.query;
      const product = await productManager.getProducts(limit);
      res.render("home", { product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
});

export default router; 

