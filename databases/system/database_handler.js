import { response } from 'express'
import fs from 'fs'

class SystemContainer {

    constructor(collection) {

        this.file = 'databases/system/MyFile.json'
        this.fileRedeable = JSON.parse(fs.readFileSync(this.file, 'utf8'))
        this.collection = this.fileRedeable[collection]

    }

    getProducts() {
        return { res: this.collection ? this.collection : [], error: false, description: false }
    }

    getProduct(_id) {

        let data = this.collection.find(x => { return x._id == parseInt(_id) })

        return { res: data?data:[], error: false, description: false }

    }

    async saveProduct(product) {

        product._id = this.collection.length + 1
        product.timestamp = new Date().getDate()

        if(!product.thumbnail){
            product.thumbnail = 'https://icon-library.com/images/icon-picture/icon-picture-5.jpg'
        }

        if(!product.name || !product.price || !product.description || !product.stock){
            return { res: false, error: 'fields_required', description: 'All fields are required unless thumbnail' }
        }

        this.collection.push(product)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, error: err.name, description: err.message }
            }
        })

        return { res: true, error: false, description: false }
    }

    async updateProduct(product, _id) {

        let objIndex = this.collection.findIndex(x => { return x._id == parseInt(_id) })

        if (objIndex == -1) {
            return { res: false, error: true, description: "ID" }
        }

        let oldProduct = this.collection.map(element => {
            if (element._id == _id) {
                return element
            }
        })

        product._id = _id
        product.timestamp = oldProduct.timestamp

        this.collection[objIndex] = product

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, error: err.name, description: err.message }  
            }
        })

        return { res: true, error: false, description: false }
    }

    async deleteProduct(_id) {

        let index = this.collection.findIndex(x => { return x._id == parseInt(_id) })

        if (index == -1) {
            return { res: false, error: 'ID', description: "The ID doesn't exist" }
        }

        this.collection.splice(index, 1)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, error: err.name, description: err.message }
            }
        })

        return { res: true, error: false, description: false }
    }

    getCarts(){
        return { res: this.collection ? this.collection : [], error: false, description: false  }
    }

    getCart(_id) {

        const cartIndex = this.collection.findIndex(x => { return x._id == parseInt(_id) })

        if (cartIndex==-1) {
            return { res: false, error: 'ID', description: "The cartID doesn't exist" }
        }
 
        return { res: this.collection[cartIndex], error: false, description: false }
    }

    async saveCart() {

        const cart = {
            _id: 1, 
            products: [], 
            timestamp:Date.now()
        }

        if(this.collection.find(c=>{return c._id==1})){
            return { res: cart._id, error: false, description: false }
        }

        this.collection.push(cart)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, error: err.name, description: err.message }
            }
        })

        return { res: cart._id, error: false, description: false }
    }

    async updateCart(cartId, productId) {
        let product = this.fileRedeable['products'].find(p=>{return p._id == productId})

        if (!product) {
            return { res: false, error: 'ID', description: "The prodID doesn't exist" }
        }
        
        let response = this.getCart(cartId)

        if (response.error == 'ID'){
            return { res: false, error: 'ID', description: "The cartID doesn't exist" }
        }

        let productCartIndex = response.res.products.findIndex(p=>{return p._id==productId})
        if (productCartIndex==-1){
            product.quantity = 1
            response.res.products.push(product)
        }else{
            response.res.products[productCartIndex].quantity+=1
        }
        
        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, error: err.name, error: err.message }
            }
        })

        return { res: { cartId: cartId, prodId: productId }, error: false, description: false }
    }

    async deleteCart(_id) {
        let cartIndex = this.fileRedeable.carts.findIndex(x => { return x._id == parseInt(_id) })

        console.log(cartIndex)

        if(cartIndex==-1){
            return { res: false, error: 'ID', description: "The ID doesn't exist" }
        }

        this.collection.splice(cartIndex, 1)
        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                console.log(err)
            }
        })

        return { res: cart._id, error: false, description: false  }
    }

    async deleteProductCart(cartId, productId) {
        try {

            let cart = this.collection.find(x => { return x._id == parseInt(cartId) })

            if(cart==undefined){
                return { res: false, error: 'ID', description: "The cartID doesn't exist" }
            }

            let productIndex = cart.products.findIndex(p => { return p._id == parseInt(productId) })

            if(productIndex==-1){
                return { res: false, error: 'ID', description: "The prodID doesn't exist" }
            }

            let productCartIndex = cart.products.findIndex(p =>{return p._id == productId})
            if(cart.products[productCartIndex].quantity==1){
                cart.products.splice(productCartIndex, 1)
            }else{
                cart.products[productCartIndex].quantity-=1
            }

            await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
                if (err) {
                    return { res: false, error: error.name, description: error.message }
                }
            })

            return { res: { cartId: _id, prodId: productId }, error: false, description: false }
        } catch (err) {
            console.log(err)
            return { res: false, error: err.name, description: err.message }
        }

    }

}

export default SystemContainer