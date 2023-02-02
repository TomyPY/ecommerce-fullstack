//import FirebaseProductsDAO from './products/productsFirebaseDAO'
//import FirebaseCartsDAO from './products/cartsFirebaseDAO'
import MongoProductsDAO from './products/productsMongoDAO.js'
import MongoCartsDAO from './carts/cartsMongoDAO.js'
import SystemProductsDAO from './products/productsSystemDAO.js'
import SystemCartsDAO from './carts/cartsSystemDAO.js'

import { persistenceType } from '../../config.js'
import cart from '../mongoDB/models/cart.js';

let productsDAO = null;
let cartsDAO = null;

if (persistenceType == "system") {
  productsDAO = new SystemProductsDAO();
  cartsDAO = new SystemCartsDAO();
}

if (persistenceType == "mongo") {
  productsDAO = new MongoProductsDAO();
  cartsDAO = new MongoCartsDAO();
}

if (persistenceType == "firebase") {
  productsDAO = new FirebaseProductsDAO();
  cartsDAO = new FirebaseCartsDAO();
}

export { productsDAO, cartsDAO }