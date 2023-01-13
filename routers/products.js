import { Router } from 'express'
import database from '../database/database_handler.js'

const router = Router()

router.get('/', (req, res)=>{

    let products = database.getAll()
    let cart = database.getCart()
    let admin = database.getAdmin()

    console.log(cart.products.length)

    res.render('productsPage', {products:products, cartCounter:cart.products.length, admin: admin, error:false})

})

router.get('/:id', (req, res)=>{

    let products = [database.getById(req.params.id)]
    let cart = database.getCart()
    let admin = database.getAdmin()

    if(!products[0]){

        res.json({error:"400", route:"http://localhost:8080/api/products", method:"get", description:"Product doesn't exist"})

    }    
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    res.render('productsPage', {products:products, cartCounter:cartCounter, admin: admin, error:false})

})

router.get("/update/:id", (req, res)=>{

    if(!database.getAdmin()){
        res.json({error:"402", route:"http://localhost:8080/api/products", method:"get", description:"Unauthorized"})
    }

    let product = database.getById(req.params.id)
    let admin = database.getAdmin()
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    if (!product){
        res.json({error:"400", route:"http://localhost:8080/api/products", method:"get", description:"Product doesn't exist"})
    }

    res.render('updateProductPage', {product, cartCounter:cartCounter, admin, error:false})

})

router.post('/', async(req, res)=>{

    let product = {...req.body}
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    
    if(product.name == '' || product.price == '' || product.thumbnail == '' || product.stock == '' || product.description == ''){
        
        console.log('error')

        let products = database.getAll()
        let admin = database.getAdmin()
    let cart = database.getCart()
        res.render('productsPage', {products:products, cartCounter:cartCounter, admin, error:'All fields are required'})
        return

    }

    product.price = parseInt(product.price)
    product.stock = parseInt(product.stock)


    await database.save(product)
    res.redirect('/api/products')

})

router.post('/update/:id', async (req, res)=>{
    let product = {...req.body}
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    if(product.name == '' || product.price == '' || product.thumbnail == '' || product.stock == '' || product.description == ''){
        
        console.log('error')

        let admin = database.getAdmin()
        res.render('updateProductPage', {product:product, cartCounter: cartCounter ,admin, error:'All fields are required'})
        return

    }

    product.price = parseInt(product.price)
    product.stock = parseInt(product.stock)

    await database.updateById(req.params.id, product)
    res.redirect('/api/products')
})

router.delete('/delete/:id', async(req ,res)=>{

    let _id = req.params.id
    let result = await database.deleteById(_id)

    if (!result){
        res.json({error:"400", route:"http://localhost:8080/api/products", method:"delete", description:"Product doesn't exist"})
    }

    res.json({complete:'Delete has been completed'})
})

export default router