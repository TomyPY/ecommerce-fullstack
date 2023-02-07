import { cartsDAO } from '../databases/daos/generalDAO.js'

const createCart = async (req, res) => {
    let response = await cartsDAO.createCart()
   
    if(response.error){
        console.log(response)
        res.status(500).json({res:false,error:response.error,description:response.description})
        return
    }

    res.status(200).json({cartId: response.res})
}

const deleteCart = async (req, res) => {

    let response = await cartsDAO.deleteCartById(req.params.id)

    if (response.error) {
        res.status(400).json({ error: "400", route: `http://localhost:8080/api/cart/delete/${req.params.id}`, method: "delete", description: response.description })
        return
    }

    res.status(200).json({cartId: response.res})
}

const getProducts = async (req, res) => {

    let response = await cartsDAO.getById(req.params.id)

    if(response.error){
        console.log(response)
        res.json({ error: "400", route: `http://localhost:8080/api/cart/${req.params.id}/products`, method: "get", description: response.description })
        return
    }

    let cart = response.res

    res.render('shoppingCart', { products: cart.products, cartCounter: 0 })
}

const updateProductToCart = async (req, res) => {

    let cartId = req.params.id
    let productId = req.body._id

    let response = await cartsDAO.updateById(cartId, productId)

    if (response.error) {
        console.log(response)
        res.status(500).json({ error: "400", route: `http://localhost:8080/api/cart/${cartId}/products`, method: "post", description: response.description })
        return
    }

    res.status(200).json({cartId: response.res.cartId, prodId: response.res.prodId})
}

const deleteProduct = async (req, res) => {
    
    let response = await cartsDAO.deleteCartProduct(parseInt(req.params.id), parseInt(req.params.prod_id))
    
    if(response.error){
        console.log(response)
        res.status(500).json({error:response.description})
        return
    }


    res.sendStatus(200)
}

export default { createCart, deleteCart, getProducts, updateProductToCart, deleteProduct }