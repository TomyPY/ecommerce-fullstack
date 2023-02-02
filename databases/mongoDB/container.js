import product from './models/product.js'

class ContainerMongoDB {
    constructor(model = Collection) {
        this.model = model
    }

    async getProducts() {
        try {
            const data = await this.model.find({})
            return { res: data ? data : [], status: true, error: false }
        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

    async getProduct(_id) {
        try {
            const data = await this.model.findOne({ _id: _id })
            return { res: data?data:[], status: true, error: false }
        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

    async saveProduct(object) {
        try {
            const data = await this.model.find({})
            const ids = data.map((product) => product._id)
            const idMaximo = Math.max(...ids)

            object._id = ids.length>0?idMaximo+1:1
            object.timestamp = Date.now()
            
            await this.model.create(object)
            return { res: true, status: true, error: false }
        } catch (err) {
            if(err.name==='ValidationError'){
                return { res: false, status: false, error: 'All fields are required unless thumbnail' }
            }
            return { res: false, status: false, error: err.message }
        }
    }

    async updateProduct(object, _id) {
        try {

            const data = await this.model.findOne({ _id: _id })

            if (!data) {
                return { res: false, status: false, error: "The ID doesn't exist" }
            }

            await this.model.updateOne({ _id: _id },
                {
                    $set:
                    {
                        "name": object.name,
                        "price": object.price,
                        "thumbnail": object.thumbnail,
                        "stock": object.stock,
                        "description": object.description
                    }
                })

            return { res: true, status: true, error: false }

        } catch (err) {
            return { res: false, status: false, error: err }
        }

    }

    async deleteProduct(_id) {
        try {
            const data = await this.model.findOne({ _id: _id })
 
            if (!data) {
                return { res: false, status: false, error: "The ID doesn't exist" }
            }

            await this.model.deleteOne({ _id: _id })
            return { res: true, status: true, error: false }

        } catch (err) {

            return { res: false, status: false, error: err }
        }
    }



    async getCartById(_id) {
        try {
            const data = await this.model.findOne({ _id: _id })

            if (!data) {
                return { res: false, status: false, error: "The ID doesn't exist" }
            }

            return { res: data, status: true, error: false }

        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

    async saveCart() {
        try {
            const cart = {
                _id: 1,
                products: []
            }

            await this.model.insertOne(cart)

            return { res: cart._id, status: true, error: err }
        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

    async deleteCart(_id) {
        try {

            const cart = await this.model.findOne({ "_id": _id })

            if (!cart) {
                return { res: false, status: false, error: "The ID doesn't exist" }
            }

            await this.model.deleteOne({ _id: idParsed })
            return { res: cart._id, status: true, error: false }

        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

    async addToCart(cartId, prodId, cant) {
        try {

            if (!await this.model.findOne({ _id: cartId })) {
                return { res: false, status: false, error: "The cartID doesn't exist" }
            }

            if (!await product.findOne({ _id: prodId })) {
                return { res: false, status: false, error: "The prodID doesn't exist" }
            }

            if (await this.model.findOne({ "_id": cartId, "products._id": prodId })) {
                await this.model.updateOne({ "_id": cartId, "products._id": prodId }, { $set: { "products.$.quantity": cant } })
            } else {
                await this.model.updateOne({ "_id": cartId }, { $push: { 'products': { "_id": prodId, "quantity": cant } } })
            }

            return { res: { cartId: cartId, prodId: prodId }, status: true, error: false }
        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

    async deleteFromCart(cartId, prodId) {
        try {
            if (!await this.model.findOne({ _id: cartId })) {
                return { res: false, status: false, error: "The cartID doesn't exist" }
            }

            if (!await this.model.findOne({ _id: cartId, "products._id": prodId })) {
                return { res: false, status: false, error: "The prodID doesn't exist" }
            }

            await this.model.updateOne({ "_id": cartId }, { $pull: { products: { _id: prodId } } })

            return { res: { cartId: cartId, prodId: prodId }, status: true, error: false }

        } catch (err) {
            return { res: false, status: false, error: err }
        }
    }

}

export default ContainerMongoDB