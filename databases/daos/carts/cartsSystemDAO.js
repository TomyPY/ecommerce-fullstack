import SystemContainer from '../../system/database_handler.js'

class CartsSystemDAO extends SystemContainer {
    constructor() {
        super("carts")
    }
    async getAll(){
        const data = await this.getCarts()
        return data
    }

    async getById(_id){
        const data = await this.getCart(_id)
        return data
    }

    async createCart(){
        const data = await this.saveCart()
        return data
    }

    async updateById(cartId, productId){
        const data = await this.updateCart(cartId, productId)
        return data
    }

    async deleteById(_id){
        const data = await this.deleteCart(_id)
        return data
    }

    async deleteCartProduct(cartId, productId){
        const data = await this.deleteProductCart(cartId, productId)
        return data
    }
}

export default CartsSystemDAO