import express from 'express'
import {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createReview,
    getTopProducts
} from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct)
router.get('/top', getTopProducts)
router.route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct)
router.route('/:id/reviews').post(protect, createReview)



export default router