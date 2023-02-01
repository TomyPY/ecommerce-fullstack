import database from '../databases/system/database_handler.js'

const getAll = async(req, res)=>{

    let products = database.getAll()
    let cart = database.getCart()
    let admin = database.getAdmin()

    res.render('index', {products:products, cartCounter:cart.products.length, admin: admin, error:false})
}

const getById = async(req, res)=>{

    let products = [database.getById(req.params.id)]
    let cart = database.getCart()
    let admin = database.getAdmin()

    if(!products[0]){

        res.json({error:"400", route:"http://localhost:8080/api/products", method:"get", description:"Product doesn't exist"})

    }    
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    res.render('index', {products:products, cartCounter:cartCounter, admin: admin, error:false})
}

const getUpdateFormById = async(req, res)=>{

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

}

const createProduct = async(req, res)=>{

    let product = {...req.body}
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    
    if(product.name == '' || product.price == '' || product.thumbnail == '' || product.stock == '' || product.description == ''){
        
        let products = database.getAll()
        let admin = database.getAdmin()
        let cart = database.getCart()
        res.render('index', {products:products, cartCounter:cartCounter, admin, error:'All fields are required'})
        return

    }

    product.price = parseInt(product.price)
    product.stock = parseInt(product.stock)


    await database.save(product)
    res.redirect('/api/products')

}

const updateById = async(req, res)=>{
    let product = {...req.body}
    let cart = database.getCart()
    let cartCounter = cart.products.length > 0 ? cart.products.length : 0

    if(product.name == '' || product.price == '' || product.thumbnail == '' || product.stock == '' || product.description == ''){
    
        let admin = database.getAdmin()
        res.render('updateProductPage', {product:product, cartCounter: cartCounter ,admin, error:'All fields are required'})
        return

    }

    product.price = parseInt(product.price)
    product.stock = parseInt(product.stock)

    await database.updateById(req.params.id, product)
    res.redirect('/api/products')
}

const deleteById = async(req ,res)=>{

    let _id = req.params.id
    let result = await database.deleteById(_id)

    if (!result){
        res.json({error:"400", route:"http://localhost:8080/api/products", method:"delete", description:"Product doesn't exist"})
    }

    res.json({complete:'Delete has been completed'})
}

export default {getAll, getById, getUpdateFormById, createProduct, updateById, deleteById}