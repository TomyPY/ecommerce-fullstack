import fs from 'fs'

class SystemContainer {

    constructor(collection) {

        this.file = 'databases/system/MyFile.json'
        this.fileRedeable = JSON.parse(fs.readFileSync(this.file, 'utf8'))
        this.collection = this.fileRedeable[collection]

    }

    getProducts() {
        return { res: this.collection ? this.collection : [], status: true, error: false }
    }

    getProduct(_id) {

        let data = this.collection.find(x => { return x._id == parseInt(_id) })

        return { res: data?data:[], status: true, error: false }

    }

    async saveProduct(product) {

        product._id = this.collection.length + 1
        product.timestamp = new Date().getDate()

        if(product.thumbnail == ''){
            product.thumbnail = 'https://icon-library.com/images/icon-picture/icon-picture-5.jpg'
        }

        if(!product.name || !product.price || !product.description || !product.stock){
            return { res: false, status: false, error: 'All fields are required unless thumbnail' }
        }

        this.collection.push(product)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, status: false, error: err }
            }
        })

        return { res: true, status: true, error: false }
    }

    async updateProduct(product, _id) {

        let objIndex = this.collection.findIndex(x => { return x._id == parseInt(_id) })

        if (objIndex == -1) {
            return { res: false, status: false, error: "The ID doesn't exist" }
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
                console.log(err)
            }
        })


        return { res: true, status: true, error: false }
    }

    async deleteProduct(_id) {

        let index = this.collection.findIndex(x => { return x._id == parseInt(_id) })

        if (index == -1) {
            return { res: false, status: false, error: "The ID doesn't exist" }
        }

        let product = this.collection[index]

        this.collection.splice(index, 1)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                console.log(err)
            }
        })

        return { res: true, status: true, error: false }
    }

    getCarts(){
        return { res: this.collection ? this.collection : [], status: true, error: false }
    }

    getCart(_id) {

        const cartIndex = this.collection.findIndex(x => { return x._id == parseInt(_id) })

        if (cartIndex==-1) {
            return { res: false, status: false, error: "The cartID doesn't exist" }
        }

        return this.collection[cartIndex]
    }

    async saveCart() {

        const cart = {
            _id: 1, 
            products: [], 
            timestamp:Date.now()
        }

        this.collection.push(cart)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, status: false, error: err }
            }
        })

        return { res: cart._id, status: true, error: err }
    }

    async updateCart(cartId, productId) {
        let responseProduct = this.getProduct(productId)

        if (responseProduct.res==[]) {
            return { res: false, status: false, error: "The prodID doesn't exist" }
        }
        
        let responseCart = this.getCartById(cartId)

        if (!responseCart.status && responseCart.error=="The cartID doesn't exist") {
            return { res: false, status: false, error: "The cartID doesn't exist" }
        }

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                return { res: false, status: false, error: err }
            }
        })

        return { res: { cartId: cartId, prodId: prodId }, status: true, error: false }
    }

    async deleteCart(_id) {
        let cartIndex = this.fileRedeable.carts.findIndex(x => { return x._id == parseInt(_id) })

        if(cartIndex==-1){
            return { res: false, status: false, error: "The ID doesn't exist" }
        }

        this.collection.splice(cartIndex, 1)
        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
            if (err) {
                console.log(err)
            }
        })

        return { res: cart._id, status: true, error: false }
    }

    async deleteProductCart(cartId, productId) {
        try {

            let cartIndex = this.collection.findIndex(x => { return x._id == parseInt(cartId) })

            if(cartIndex==-1){
                return { res: false, status: false, error: "The cartID doesn't exist" }
            }

            let cart = this.collection[cartIndex]

            let productIndex = cart.products.findIndex(p => { return p._id == parseInt(productId) })

            if(productIndex==-1){
                return { res: false, status: false, error: "The prodID doesn't exist" }
            }

            cart.products.splice(productIndex, 1)
            await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err => {
                if (err) {
                    return { res: false, status: false, error: err }
                }
            })

            return { res: { cartId: _id, prodId: productId }, status: true, error: false }
        } catch (err) {
            console.log(err)
            return { res: false, status: false, error: err }
        }

    }

}

export default SystemContainer