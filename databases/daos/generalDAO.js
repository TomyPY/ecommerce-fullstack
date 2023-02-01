import FirebaseProductsDAO from './products/productsFirebaseDAO'
import FirebaseCartsDAO from './products/cartsFirebaseDAO'
import MongoProductsDAO from './products/productsMongoDAO'
import MongoCartsDAO from './products/cartsMongoDAO'
import SystemProductsDAO from './products/productsSystemDAO'
import SystemCartsDAO from './products/cartsSystemDAO'

const {persistenceType} = require('../../config.js')

let productDao = null;
let cartDao = null;

if (persistenceType === "system") {
  productDao = new SystemProductsDAO();
  cartDao = new SystemCartsDAO();
}

if (persistenceType === "mongo") {
  productDao = new MongoProductsDAO();
  cartDao = new MongoCartsDAO();
}

if (persistenceType === "firebase") {
  productDao = new FirebaseProductsDAO();
  cartDao = new FirebaseCartsDAO();
}

export default { productDao, cartDao }