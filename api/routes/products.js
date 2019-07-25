const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductController = require('../controllers/products')


// multer file upload configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads')
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + file.originalname)
	}
})
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		// Accept file
		cb(null, true)
	} else {
		// Reject file
		cb(null, false)
	}
}
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5 //filesize in bytes (5Mb)
	},
	fileFilter: fileFilter
})

// DEV: Port constant for localhost
const PORT = 3000

// GET
// Get all products
router.get('/', ProductController.productsGetAll)

// POST
// Create new product
router.post('/', checkAuth, upload.single('productImage'), ProductController.productsCreateOne)

// GET
// Get product with id
router.get('/:productId', ProductController.productsGetOne)

// PATCH
// Update existing product with id
router.patch('/:productId', checkAuth, ProductController.productsPatchOne)

// DELETE
// Delete producs with id
router.delete('/:productId', checkAuth, ProductController.productsDeleteOne)


module.exports = router