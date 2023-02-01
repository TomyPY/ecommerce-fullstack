import database from '../databases/system/database_handler.js'

const createCart = async(req, res) =>{
    res.json(database.getCart()._id)
}

const deleteCart = async(req,res)=>{

    let result = database.deleteCart(req.params.id)
    
    if (!result.ok){
        res.json({error:"400", route:`http://localhost:8080/api/cart/delete/${req.params.id}`, method:"delete", description:result.description})
        return
    }

    res.json({ok:true, error:false})

}

const getProducts = async(req, res) =>{

    let shoppingCart = database.getCart()
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    res.render('shoppingCart', {products:shoppingCart.products, cartCounter: cartCounter})

} 

const updateProductToCart = async(req,res)=>{

    let cartId = req.params.id
    let productId = req.body._id 

    let result = await database.addToCart(cartId, productId)

    if(!result.ok){
        res.json(result)
    }
   
    res.json({'ok':true, error:false})

}

const deleteProduct = async(req,res)=>{

    database.deleteProductCart(parseInt(req.params.id), parseInt(req.params.prod_id))
    res.json({ok:true})
    
}

export default {createCart, deleteCart, getProducts, updateProductToCart, deleteProduct}