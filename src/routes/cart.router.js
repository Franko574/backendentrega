import {Router} from 'express';
const router = Router();

const carts = [];

router.get('/',(req,res)=>{
    res.status(200).json(carts)
})

router.post('/', (req,res)=>{
   const cart =req.body;
   carts.push(cart)
   res.status(200).json({msg:'Cart agregado con exito', cart})
})

export default router;