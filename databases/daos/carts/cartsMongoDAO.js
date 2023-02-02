import MongoContainer from '../../mongoDB/container.js'
import cartModel from '../../mongoDB/models/cart.js'

class CartsMongoDAO extends MongoContainer {
    constructor() {
        super(cartModel)
    }

    async getAll(_id) {
        const data = await this.getCartById(_id)
        return data
    }

    async createCart() {
        const data = await this.saveCart()
        return data
    }

    async deleteCartById(_id) {
        const data = await this.deleteCart(_id)
        return data
    }

    async updateById(product, id) {
        const data = await this.updateProduct(product, id)
        return data
    }

    async deleteById(id) {
        const data = await this.deleteById(id)
        return data
    }
}

export default CartsMongoDAO