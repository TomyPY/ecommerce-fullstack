import SystemContainer from '../../system/database_handler.js'

class ProductsSystemDAO extends SystemContainer {
    constructor() {
        super("products")
    }
    async getAll(){
            const data = await this.getProducts()
            return data
    }

    async getById(_id){
        const data = await this.getProduct(_id)
        return data
    }

    async createProduct(product){
        const data = await this.saveProduct(product)
        return data
    }

    async updateById(product, _id){
        const data = await this.updateProduct(product, _id)
        return data
    }

    async deleteById(_id){
        const data = await this.deleteProduct(_id)
        return data
    }
}

export default ProductsSystemDAO