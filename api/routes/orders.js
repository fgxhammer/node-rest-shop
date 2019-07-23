const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../models/order')

const PORT = 3000

//Get all orders
router.get('/', (req, res, next) => {
	Order.find()
		.select("product quantity _id")
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				orders: docs.map(doc => {
					return {
						_id: doc.id,
						product: doc.product,
						quantity: doc.quantity,
						request: {
							type: "GET",
							url: "http://localhost:" + PORT + "/orders/" + doc._id
						}
					}
				})
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

//Get order by id
router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId
	Order
		.find()
		.select("product quantity _id")
		.then(doc => {
			res.status(200).json({
				product: doc,
				request: {
					type: "GET",
					url: "http://localhost:" + PORT + "/orders/" + id
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

// Create new order
router.post('/', (req, res, next) => {
	const order = new Order({
		_id: mongoose.Types.ObjectId(),
		product: req.body.productId,
		quantity: req.body.quantity
	})
	order
		.save()
		.then(result => {
			res.status(201).json({
				message: "Order stored!",
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: "GET",
					url: "http://localhost:" + PORT + "/orders/" + result.id
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

//Delete order by id
router.delete('/:orderId', (req, res, next) => {
	res.status(200).json({
		message: "Order deleted!",
		id: req.params.orderId
	})
})

module.exports = router