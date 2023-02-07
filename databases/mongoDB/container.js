import cart from './models/cart.js'
import product from './models/product.js'
import {connectMongo} from './conn.js'
connectMongo()

class ContainerMongoDB {
    constructor(model = Collection, products=product) {
        this.model = model
        this.products = products
    }

    async getProducts() {
        try {
            const data = await this.model.find({})
            return { res: data ? data : [], error: false, description: false }
        } catch (err) {
            return { res: false, error: err.name, description: err.message }
        }
    }

    async getProduct(_id) {
        try {
            const data = await this.model.findOne({ _id: _id })
            return { res: data?data:[], error: false, description: false }
        } catch (err) {
            return { res: false, error: err.name, description: err.message }
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
            return { res: true, error: false, description: false }

        } catch (err) {
            if(err.name==='ValidationError'){
                return { res: false, error: 'fields_required', description: 'All fields are required unless thumbnail' }
            }
            return { res: false, error: err.name, description: err.message }
        }
    }

    async updateProduct(object, _id) {
        try {

            const data = await this.model.findOne({ _id: _id })

            if (!data) {
                return { res: false, error: 'ID', description: "The ID doesn't exist" }
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

            return { res: true, error: false, description: false }

        } catch (err) {
            return { res: false, error: err.name, description: err.message }
        }

    }

    async deleteProduct(_id) {
        try {
            const data = await this.model.findOne({ _id: _id })
 
            if (!data) {
                return { res: false, error: 'ID', description: "The ID doesn't exist" }
            }

            await this.model.deleteOne({ _id: _id })
            return { res: true, error: false, description: false }

        } catch (err) {

            return { res: false, error: err.name, description: err.message }
        }
    }

    async getCartById(_id) {
        try {
            const data = await this.model.findOne({ _id: _id })

            if (!data) {
                return { res: false, error: 'ID', description: "The ID doesn't exist" }
            }

            return { res: data, error: false, description: false }

        } catch (err) {
            return { res: false, error: err.name, description: err.message }
        }
    }

    async saveCart() {
        try {

            if(await this.model.findOne({_id:1})){
                console.log('returned')

                return { res: 1, error: false, description: false }
            }

            const cart = {
                _id: 1,
                products: []
            }

            await this.model.create(cart)
            console.log('created')

            return { res: cart._id, error: false, description: false }
        } catch (err) {
            console.log(err)
            return { res: false, error: err.name, description: err.message }
        }
    }

    async deleteCart(_id) {
        try {

            const cart = await this.model.findOne({ "_id": _id })

            if (!cart) {
                return { res: false, error: 'ID', description: "The ID doesn't exist" }
            }

            await this.model.deleteOne({ _id: _id })
            return { res: cart._id, error: false, description: false }

        } catch (err) {
            return { res: false, error: err.name, description: err.message }
        }
    }

    async updateCart(cartId, prodId) {
        try {

            let product = await this.products.findOne({_id:prodId})

            if (!product){
                return { res: false, error: 'ID', description: "The prodID doesn't exist" }
            }

            let cart = await this.model.findOne({ _id: cartId })

            if (!cart) {
                return { res: false, error: 'ID', description: "The cartID doesn't exist" }
            }

            if (cart.products.find(p=>{return parseInt(p._id) == parseInt(prodId)})) {
                await this.model.findOneAndUpdate({ "_id": cartId, "products._id": parseInt(prodId) }, { $inc: { "products.$.quantity": 1 } })
            } else {
                await this.model.updateOne({ "_id": cartId }, { $push: { 'products': product } })
            }

            return { res: { cartId: cartId, prodId: prodId }, error: false, description: false }
        } catch (err) {
            console.log(err)
            return { res: false, error: err.name, description: err.message }
        }
    }

    async deleteFromCart(cartId, prodId) {
        try {
            let cart = await this.model.findOne({ _id: cartId })

            if (!cart) {
                return { res: false, error: 'ID', description: "The cartID doesn't exist" }
            }
            
            let product = cart.products.find(p=>{return p._id == prodId})

            if (!product) {
                return { res: false, error: 'ID', description: "The prodID doesn't exist" }
            }

            if (product.quantity>1){
                await this.model.findOneAndUpdate({ "_id": cartId, "products._id": prodId }, { $inc: { "products.$.quantity": -1 } })

            }else{
                await this.model.updateOne({"_id":cartId, "product._id:":prodId}, {$pull:{"products":{"_id":prodId}}})
            }

            return { res: { cartId: cartId, prodId: prodId }, error: false, description: false }

        } catch (err) {
            console.log(err)
            return { res: false, error: err.name, description: err.message }
        }
    }

}

export default ContainerMongoDB