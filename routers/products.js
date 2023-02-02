import { Router } from 'express'
import products from '../controllers/products.js'

const router = Router()

router.get('/', products.getAll)

router.get('/:id', products.getById)

router.get("/update/:id", products.getUpdateFormById)

router.post('/', products.createProduct)

router.post('/update/:id', products.updateById)

router.delete('/delete/:id', products.deleteById)

export default router