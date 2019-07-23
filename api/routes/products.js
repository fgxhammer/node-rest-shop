const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

const PORT = 3000

// Get all products
router.get('/', (req, res, next) => {
	Product.find()
		.select("name price _id") //Query string for fields
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				products: docs.map(doc => {
					return {
						name: doc.name,
						price: doc.price,
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

// Create new product
router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
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

// Get product with id
router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product
		.findById(id)
		.select("name price _id")
		.exec()
		.then(doc => {
			if(doc) {
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

// Update existing product with id
router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId
	const updateOps = {}
	for(const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	Product.update({ _id: id }, { $set: updateOps })
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

// Delete producs with id
router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId
	Product.remove({_id: id})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Deleted product",
				request: {
					type: "POST",
					url: "http://localhost:" + PORT + "/products/",
					body: { name: "String", price: "Number"}
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