import firebase from 'firebase-admin'
const db = firebase.firestore()
const FieldValue = require('firebase-admin').firestore.FieldValue

class ContenedorFirebase {
    constructor(collection) {
        this.collection = collection
    }

    async getAll() {
        const query = db.collection(this.collection)
        const querySnapShot = await query.get()
        let docs = querySnapShot.docs
        const data = docs.map((doc) => ({
            id: parseInt(doc.id),
            name: doc.data().name,
            price: doc.data().price,
            thumbnail: doc.data().thumbnail,
            stock: doc.data().stock,
            description: doc.data().description,
            timestamp: doc.data().timestamp
        }))
        return data
    }

    async getById(id) {
        const query = db.collection(this.collection)
        const doc = query.doc(`${id}`)
        const item = await doc.get()
        const data = item.data()
        return data
    }

    async saveProduct(object) {
        const query = db.collection(this.collection)
        const data = await this.getAll()
        const ids = data.map((producto) => producto.id)
        const idMaximo = Math.max(...ids)
        
        object.id = ids ? idMaximo : 1
        object.timestamp = Date.now()

        let doc = query.doc(`${object.id}`)
        res = await doc.create(object)
        return res
    }

    async updateProduct(object, id) {
        const query = db.collection(this.collection)
        const data = await this.getById(id)
        object.id = id
        object.timestamp = data.timestamp
        let doc = query.doc(`${object.id}`)
        await doc.update(object)
    }
            
    async deleteById(id) {
        const query = db.collection(this.collection)
        const data = await this.getById(id)
        if (data == undefined) {
            return false
        } else {
            let doc = query.doc(`${id}`)
            await doc.delete()
        }
    }

    async getAllCarts() {
        const query = db.collection(this.collection)
        const querySnapShot = await query.get()
        let docs = querySnapShot.docs

        if (!docs){
            return false
        }

        const data = docs.map((doc) => ({
            id: doc.id,
            timestamp: doc.data().timestamp,
            productos: doc.data().productos
        }))
        return (data)
    }

    async getCartById(id) {
        const query = db.collection(this.collection) 
        const doc = query.doc(`${id}`)
        const item = await doc.get()
        const data = item.data()
        if (data == undefined) {
            return false
        } else {
            const item = await doc.get()
            const data = item.data().productos
            return data
        }
        
    }

    async saveCart() {
        const query = db.collection(this.collection)
        const doc = query.doc(`${main.userLogged}`)
        const item = await doc.get()
        const data = item.data()
        if (data == undefined) {
            return true
        }
        return false
    }

    async deleteCart(id) {
        const query = db.collection(this.collection)
        const data = await this.getById(id)
        if (data == undefined) {
            return false
        } 

        let doc = query.doc(`${id}`)
        await doc.delete()
        return true
    }

    async addToCart(id, cant) {

        const queryProds = db.collection("products")
        const docFind = queryProds.doc(`${id}`)
        const itemFind = await docFind.get()
        const dataFind = itemFind.data()
        const query = db.collection(this.collection)
        const doc = query.doc(`${id}`)
        const user = await doc.get()
        const findCart = user.data()
        const addedProduct = this.productBuilder(dataFind, cant)

        if (await this.productExistence(id) == -1) {
            await db.collection(`${this.collection}`).doc(`${id}`)
                .update('products', FieldValue.arrayUnion(addedProduct), { merge: true })
        } else {
            const eraser = await findCart.products[await this.productExistence(id)]
            await db.collection(`${this.collection}`).doc(`${id}`)
                .update('products', FieldValue.arrayRemove(eraser))
            await db.collection(`${this.collection}`).doc(`${id}`)
                .update('products', FieldValue.arrayUnion(addedProduct), { merge: true })
        }
       
    }

    async deleteFromCart(id, idProd) {
        const query = db.collection(this.collection)
        const doc = query.doc(`${id}`)
        const item = await doc.get()
        const data = item.data()
        const eraser = await data.productos[await this.productExistence(idProd)]
        await db.collection(`${this.collection}`).doc(`${id}`).update('products', FieldValue.arrayRemove(eraser))  
    }

    productBuilder(source, cant) {
        const product = {
            id: source.id,
            timestamp: source.timestamp,
            name: source.nombre,
            description: source.detalle,
            thumbnail: source.thumbnail,
            price: source.precio,
            stock: cant,
        }
        return producto
    }

    async newCart(id, products) {
        const query = db.collection(this.collection)
        const cart = { id: id, timestamp: Date.now(), products: products }
        let doc = query.doc(`${id}`)
        await doc.create(cart)
    }

    async productExistence(id) {
        const data = await this.getCartById(id)
        const result = await data.findIndex((producto) => producto.id == id)
        return result
    }
}

export default ContenedorFirebase