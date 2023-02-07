
import firebase from 'firebase-admin'
import {connectFirebase} from './conn.js'

await connectFirebase()
const db = firebase.firestore()

const FieldValue = firebase.firestore.FieldValue

class ContenedorFirebase {
    constructor(collection) {
        this.collection = db.collection(collection)
    }

    async getProducts() {
        try{
            const querySnapShot = await this.collection.get()
            const docs = await querySnapShot.docs.map(doc=>{return doc.data()})
            
            return {res:docs, error:false, description:false}
        }catch(err){
            return {res:docs, error:err.name, description:err.message}
        }
    }

    async getProduct(id) {
        try{
            const doc = await this.collection.doc(`${id}`).get()
            const data = doc.data()
            return {res:data?data:[], error:false, description:false}
        }catch(err){
            return {res:false, error:err.name, description:err.message}
        } 
    }

    async saveProduct(product) {
        try{
            const data = await this.getProducts()
            let id = 1

            if(data.error){
                return {res:false, error:data.error, description:data.description}
            }

            if(data.res.length > 0){
                id = data.res.reduce((acc, cur)=>{Math.max(acc, cur._id), -Infinity})+1
            }
            
            product._id = id
            product.timestamp = Date.now()
            product.thumbnail = product.thumbnail?product.thumbnail:'https://icon-library.com/images/icon-picture/icon-picture-5.jpg'
            
            console.log(product)

            let doc = await this.collection.doc(`${product._id}`).set(product)

            return {res:product._id, error:false, description:false}
        }catch(err){
            console.log(err)
            return {res:false, error:err.name, description:err.message}
        }
    }

    async updateProduct(product, id) {
        try{
            let data = await this.getProduct(id)

            if(data.error){
                return {res:false, error:data.error, description:data.description}
            }else if(!data.res){
                return {res:false, error:'ID', description:'The product doesnt exist'}
            }
            
            product._id = data.res._id
            product.timestamp = data.res.timestamp
            console.log(product)

            await this.collection.doc(`${id}`).update(product)
            return {res:product._id, error:false, description:false}
        }catch(err){
            return {res:false, error:err.name, description:err.message}
        }
    }
            
    async deleteProduct(id) {
        try{

            const data = await this.getProduct(id)
            if (!data.res) {
                return {res:false, error:'ID', description:'The product ID doesnt exist'}
            } 
            await this.collection.doc(`${id}`).delete()
            return {res:id, error:false, description:false}
        }catch(err){
            return {res:false, error:err.name, description:err.message}
        }
        
    }

    async getCartById(id) {
        try{

            const doc = await this.collection.doc(`${id}`).get()
            const data = await doc.data()

            if (data == undefined) {
                await this.saveCart()

                const cart = {_id:1, products:[]}

                return {res:cart, error:false, description:false}         
            } 

            return {res:data, error:false, description:false}

        }catch(err){
            return {res:false, error:err.name, description:err.message}
        }
        
    }

    async saveCart() {

        const cart = {
            _id: 1,
            products: []
        }

        await this.collection.doc(`${1}`).set(cart)
        return {res:1, error:false, description:false}
    }

    async deleteCart(id) {
        try{

            const data = await this.getById(id)

            if (data.error) {
                return {res:false, error:data.error, description:data.description}
            } 

            await this.collection.doc(`${id}`).delete()
            return {res:id, error:false, description:false}

        }catch(err){
            return {res:false, error:err.name, description:err.message}
        }
    }

    async updateCart(cartId, prodId) {

        try{
            const prodCollection =await db.collection("products")
            const productSnapshot =await prodCollection.doc(`${prodId}`).get()
            const product = await productSnapshot.data()

            if(!product){
                return {res:false, error:"ID", description:"Product ID doesnt exist"}
            }

            const cartSnapshot =await this.collection.doc(`${cartId}`).get()
            const cart = await cartSnapshot.data()

            if(!cart){
                return {res:false, error:"ID", description:"Cart ID doesnt exist"}
            }

            const productIndex = cart.products.findIndex(p=>{return parseInt(p._id) == parseInt(prodId)})
            if (productIndex != -1) {
                cart.products[productIndex].quantity+=1
            } else {
                product.quantity = 1
                cart.products.push(product)
            }

            this.collection.doc(`${cartId}`).update(cart)

            return { res: { cartId: cartId, prodId: prodId }, error: false, description: false }
        }catch(err){
            return { res: false, error: err.name, description: err.message }
        }
    }

    async deleteFromCart(cartId, prodId) {
        try{
            const prodCollection =await db.collection("products")
            const productSnapshot =await prodCollection.doc(`${prodId}`).get()
            const product = await productSnapshot.data()

            if(!product){
                return {res:false, error:"ID", description:"Product ID doesnt exist"}
            }

            const cartSnapshot =await this.collection.doc(`${cartId}`).get()
            const cart = await cartSnapshot.data()

            if(!cart){
                return {res:false, error:"ID", description:"Cart ID doesnt exist"}
            }

            
            const productIndex = cart.products.findIndex(p=>{return parseInt(p._id) == parseInt(prodId)})
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity-=1
            } else {
                cart.products.splice(productIndex, 1)
            }

            this.collection.doc(`${cartId}`).update(cart)

            return { res: { cartId: cartId, prodId: prodId }, error: false, description: false }
        }catch(err){
            return { res: false, error: err.name, description: err.message }
        }  
    }

}

export default ContenedorFirebase