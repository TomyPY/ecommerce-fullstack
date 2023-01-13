import e, { Router } from 'express'
import database from '../database/database_handler.js'

const router = Router()

router.get('/products', (req, res) =>{

    let shoppingCart = database.getCart()
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    res.render('shoppingCart', {products:shoppingCart.products, cartCounter: cartCounter})

})

//DEVUELVE ID DEL CARRITO O CREA UNO Y DEVUELVE ID
router.post('/', (req, res) =>{
    res.json(database.getCart()._id)
})

router.post('/:id/products', async (req,res)=>{

    let cartId = req.params.id
    let productId = req.body._id 

    let result = await database.addToCart(cartId, productId)

    if(!result.ok){
        res.json(result)
    }
   
    res.json({'ok':true, error:false})

})

router.delete('/:id', async(req,res)=>{

    let result = database.deleteCart(req.params.id)
    
    if (!result.ok){
        res.json({error:"400", route:`http://localhost:8080/api/cart/delete/${req.params.id}`, method:"delete", description:result.description})
        return
    }

    res.json({ok:true, error:false})

})

router.delete('/:id/products/:prod_id', async(req,res)=>{

    database.deleteProductCart(parseInt(req.params.id), parseInt(req.params.prod_id))
    res.json({ok:true})
    
})

export default router