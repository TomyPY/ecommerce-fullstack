import { productsDAO } from '../databases/daos/generalDAO.js'
import { admin } from '../config.js'

const getAll = async (req, res) => {
    let response = await productsDAO.getAll()
    res.render('index', { products: response.res, cartCounter: 0, admin: admin, error: false })
}

const getById = async (req, res) => {
    let response = await productsDAO.getById(req.params.id)
 
    if (response.error) {
        res.json({ error: "400", route: "http://localhost:8080/api/products", method: "get", description: response.description })
        return
    }

    res.render('index', { products: response.res?[response.res]:[], cartCounter: 0, admin: admin, error: false })
}

const getUpdateFormById = async (req, res) => {

    if (!admin) {
        res.json({ error: "402", route: "http://localhost:8080/api/products", method: "get", description: "Unauthorized" })
        return
    }

    let response = await productsDAO.getById(req.params.id)

    if(response.error){
        res.json({ error: "500", route: "http://localhost:8080/api/products", method: "get", description: response.description })
        return
    }

    if(response.res.length == 0){
        res.json({ error: "400", route: "http://localhost:8080/api/products", method: "get", description: "Product doesn't exist" })
        return
    }

    res.render('updateProductPage', { product: response.res, cartCounter: 0, admin, error: false })
}

const createProduct = async (req, res) => {
    
    let product = { ...req.body }
    product.thumbnail = product.thumbnail == '' ? undefined : product.thumbnail
    let response = await productsDAO.createProduct(product)

    if (response.error == 'fields_required') {
        let response = await productsDAO.getAll()
        res.render('index', { products: response.res, cartCounter: 0, admin, error: 'All fields are required' })
        return

    }else if(response.error){
        let response = await productsDAO.getAll()
        res.json({ error: "500", route: "http://localhost:8080/api/products", method: "post", description: response.description })
        return
    }

    res.redirect('/api/products')
}

const updateById = async (req, res) => {
    let product = { ...req.body }
    let response = await productsDAO.updateById(product, req.params.id)

    if (response.error == "ID") {
        let response = await productsDAO.getById(req.params.id)
        res.render('updateProductPage', { product: response.res, cartCounter: 0, admin, error: 'All fields are required' })
        return

    }else if(response.error){
        res.json({ error: "500", route: "http://localhost:8080/api/products", method: "put", description: response.description})
        return
    }

    res.redirect('/api/products')
}

const deleteById = async (req, res) => {
    let _id = req.params.id
    let response = await productsDAO.deleteById(_id)

    if (response.error=="ID") {
        res.json({ error: "400", route: "http://localhost:8080/api/products", method: "delete", description: "Product doesn't exist" })
    }else if (response.error){
        res.json({ error: "500", route: "http://localhost:8080/api/products", method: "delete", description: response.description })
    }

    res.json({ complete: 'Delete has been completed' })
}

export default { getAll, getById, getUpdateFormById, createProduct, updateById, deleteById }