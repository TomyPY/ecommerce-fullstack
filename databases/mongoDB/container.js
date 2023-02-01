import conn from './conn'
import productModel from './models/product.js'
import cartModel from './models/cart.js'

class ContainerMongoDB {
    constructor(model) {
        this.model = model
    }
    async getAll() {
        const data = await this.model.find({});
        return data;
    }

    async getById(id) {
        const data = await this.model.find({ id: id });
        if (data.length == 0) {
            return false
        } else {
            return data[0];
        }
    }

    async saveProduct(object) {
        const data = await this.model.find({});
        const ids = data.map((product) => product.id);
        const idMaximo = Math.max(...ids);
            object.id = ids ? idMaximo : 1
            object.timestamp = Date.now();
            await this.model.create(object)
            return true
        }

    async updateProduct(object, id) {
       
        const data = await this.model.find({ id: id });
        object.id = id;
        object.timestamp = data.timestamp;
        await this.model.updateOne({ id: id },
            {
                $set:
                {
                    "nombre": object.nombre,
                    "precio": object.precio,
                    "codigo": object.codigo,
                    "thumbnail": object.thumbnail,
                    "stock": object.stock,
                    "detalle": object.detalle
                }
            })
    }

    async deleteById(id) {
        const data = await this.model.find({ id: id });
        if (data.length == 0) {
            return false
        } else {
            await this.model.deleteOne({ id: id })
        }     
    }

    async getCartById(id) {
        const data = await this.model.find({ id: id }, {"products": 1, "_id": 0 });
        if (data.length == 0) {
            return false
        } else {
            return data[0].products;
        }
    }

    async saveCart() {
        this.newCart(main.userLogged, []);
        return { id: main.userLogged };
    }

    async deleteCart(id) {
        const idParsed = parseInt(id)

        if (await this.cartFinder(main.userLogged).length == 0) {
            return { error: "carrito no encontrado" };
        } else {
            try {
                await this.model.deleteOne({ id: idParsed });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async addToCart(id, cant) {

        if (await this.productExistence(id) == 0) {
            await this.model.updateOne({ "id": 1 }, { $addToSet: { products: productadd } })
        } else {
            const query = { id: 1, "products.id": parseInt(id)};
            const updateDocument = {
                $set: { "products.$.stock": parseInt(cant)}
            };
            await this.model.updateOne(query, updateDocument)
        }
    }

    async deleteFromCart(idUser, idProd) {

        const idUsrParsed = parseInt(idUser)
        const idPrdParsed = parseInt(idProd)
        if (await this.cartFinder(idUser) == 0) {
            return false
        } else if (await this.productExistence(idPrdParsed) == 0) {
            return false
        } else {
            await this.model.updateOne({ "id": idUsrParsed }, { $pull: { products: { id: idPrdParsed } } })
        }
    }

    async newCart(id, products) {

        const cart = { id: id, timestamp: Date.now(), products: products };
        await this.model.create(cart)
    }

    async cartFinder(id) {

        const data = await this.model.find({ id: id });
        return data.length;
    }

    async productExistence(id) {

        const idParsed = parseInt(id)
        const result = await this.model.find({ $and: [{ "id": main.userLogged}, { "products.id": idParsed }]})
        return result.length
    }
}

export default ContainerMongoDB