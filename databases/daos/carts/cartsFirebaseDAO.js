import FirebaseContainer from '../../firebase/container.js'

class CartsFirebaseDAO extends FirebaseContainer {
    constructor() {
        super("carts")
    }
    async getById(_id) {
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
        const data = await this.updateCart(product, id)
        return data
    }

    async deleteCartProduct(cartId, productId) {
        const data = await this.deleteFromCart(cartId, productId)
        return data
    }
}

export default CartsFirebaseDAO