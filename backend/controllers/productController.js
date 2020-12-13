import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//@desc     Fetch all products
//@route    GET /api/products?keyword=
//@access   public

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 4
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//@desc     Fetch a single product
//@route    GET /api/products/:id
//@access   public

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Delete a single product
//@route    DELETE /api/products/:id
//@access   private/admin

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Create a single product
//@route    POST /api/products/
//@access   private/admin

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user._id,
        name: "Sample product",
        image: "/images/sample.jpg",
        description: "Sample product",
        brand: "Sample brand",
        category: "Sample Category",
        price: 9.99,
        countInStock: 7,
        rating: 1.0,
        numReviews: 1
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

//@desc     Update a single product
//@route    PUT /api/products/:id
//@access   private/admin

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = req.body.name || product.name
        product.image = req.body.image || product.image
        product.brand = req.body.brand || product.brand
        product.description = req.body.description || product.description
        product.category = req.body.category || product.category
        product.price = req.body.price || product.price
        product.countInStock = req.body.countInStock || product.countInStock
        product.rating = req.body.rating || product.rating
        product.numReviews = req.body.numReviews || product.numReviews

        const updatedProduct = await product.save()
        res.json(updatedProduct)

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Create review
//@route    POST /api/products/:id/reviews
//@access   private

const createReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    const { rating, comment } = req.body

    if (product) {
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Already reviewed')
        } else {
            const review = {
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment
            }
            product.reviews.push(review)
            product.numReviews = product.reviews.length
            product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length

            const updatedProduct = await product.save()
            res.status(201).json(updatedProduct)
        }
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@desc     Fetch top rated products
//@route    GET /api/products/top
//@access   public

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.json(products)
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createReview,
    getTopProducts
}