import { persistenceType } from '../../config.js'

let productsDAO = null;
let cartsDAO = null;

if (persistenceType == "system") {
  const {default: ProductsSystemDAO} = import('./products/productsSystemDAO.js') 
  const {default: CartsSystemDAO} = import('./products/productsSystemDAO.js')

  productsDAO = new ProductsSystemDAO();
  cartsDAO = new CartsSystemDAO();
}

if (persistenceType == "mongo") {
  const { default: ProductsMongoDAO } = await import('./products/productsMongoDAO.js')
  const { default: CartsMongoDAO } = await import('./carts/cartsMongoDAO.js')
  productsDAO = new ProductsMongoDAO();
  cartsDAO = new CartsMongoDAO();
}

if (persistenceType == "firebase") {
  const { default: ProductsMongoDAO } = await import('./products/productsFirebaseDAO.js')
  const { default: CartsFirebaseDAO } = await import('./carts/cartsFirebaseDAO.js')
  productsDAO = new ProductsMongoDAO();
  cartsDAO = new CartsFirebaseDAO();
}

export { productsDAO, cartsDAO }