import { Router } from 'express'
import carts from '../controllers/carts.js'

const router = Router()

//Creates a cart
router.post('/', carts.createCart)

//Get products of a cart
router.get('/:id/products', carts.getProducts)

//Put a new product on an existing cart
router.post('/:id/products', carts.updateProductToCart)

//Delete a product of an existing cart
router.delete('/:id/products/:prod_id', carts.deleteProduct)

//Delete a cart
router.delete('/:id', carts.deleteCart)

export default router