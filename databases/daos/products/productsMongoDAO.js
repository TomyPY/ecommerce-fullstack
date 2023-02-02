import MongoContainer from '../../mongoDB/container.js'
import productModel from '../../mongoDB/models/product.js'

class ProductsMongoDAO extends MongoContainer {
    constructor() {
        super(productModel)
    }

    async getAll() {
        const data = await this.getProducts()
        return data
    }

    async getById(id) {
        const data = await this.getProduct(id)
        return data
    }

    async createProduct(product) {
        const data = await this.saveProduct(product)
        return data
    }

    async updateById(product, id) {
        const data = await this.updateProduct(product, id)
        return data
    }

    async deleteById(id) {
        const data = await this.deleteProduct(id)
        return data
    }
}

export default ProductsMongoDAO