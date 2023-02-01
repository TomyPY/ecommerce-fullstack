import MongoContainer from '../../mongoDB/container.js'
import cartModel from '../../mongoDB/models/cart.js'

class CartsMongoDAO extends MongoContainer {
    constructor() {
        super(cartModel)
    }
    async listAll(){
            const data = await this.getAll();
            return data;
    }

    async listById(id){
        const data = await this.getById(id);
        return data;
    }

    async save(product){
        const data = await this.saveProduct(product);
        return data;
    }

    async update(product, id){
        const data = await this.updateProduct(product, id);
        return data;
    }

    async delete(id){
        const data = await this.deleteById(id);
        return data;
    }
}

export default CartsMongoDAO