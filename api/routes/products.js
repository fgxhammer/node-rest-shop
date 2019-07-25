const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')


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
router.get('/', (req, res, next) => {
	Product.find()
		.select("name price _id productImage") //Query string for fields
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				products: docs.map(doc => {
					return {
						name: doc.name,
						price: doc.price,
						productImage: doc.productImage,
						id: doc._id,
						request: {
							type: "GET",
							url: "http://localhost:" + PORT + "/products/" + doc._id
						}
					}
				})
			}
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

// POST
// Create new product
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
	console.log(req.file)
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	})
	product
		.save()
		.then(result => {
			res.status(201).json({
				message: "Product created succesfully!",
				createdProduct: {
					name: result.name,
					price: result.price,
					id: result._id,
					request: {
						type: "GET",
						url: "http://localhost:" + PORT + "/products/" + result._id
					}
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

// GET
// Get product with id
router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product
		.findById(id)
		.select("name price _id productImage")
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: "GET",
						description: "Get list off all products",
						url: "http://localhost:" + PORT + "/products"
					}
				})
			} else {
				res.status(404).json({
					message: "No valid entry found for provided ID!"
				})
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

// PATCH
// Update existing product with id
router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId
	const updateOps = {}
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	Product.update({
			_id: id
		}, {
			$set: updateOps
		})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Updated product!",
				request: {
					type: "GET",
					url: "http://localhost:" + PORT + "/products/" + id
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

// DELETE
// Delete producs with id
router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId
	Product.remove({
			_id: id
		})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Deleted product",
				request: {
					type: "POST",
					url: "http://localhost:" + PORT + "/products/",
					body: {
						name: "String",
						price: "Number"
					}
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})


module.exports = router