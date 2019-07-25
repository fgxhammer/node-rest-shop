const Order = require('../models/order')
const mongoose = require('mongoose')

//DEV
const PORT = 3000

// Get all orders
exports.ordersGetAll = (req, res, next) => {
	Order.find()
		.select("product quantity _id")
		.populate("product", "name")
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
}

// Get one order
exports.ordersGetOne = (req, res, next) => {
	Order.findById(req.params.orderId)
		.populate("product")
		.exec()
		.then(order => {
			if (!order) {
				return res.status(404).json({
					message: "Order not found!"
				})
			}
			res.status(200).json({
				order: order,
				request: {
					type: "GET",
					url: "http://localhost:" + PORT + "/orders/"
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

// Create order
exports.ordersCreateOrder = (req, res, next) => {
	Product.findById(req.body.productId)
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: "Product not found!"
				})
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				product: req.body.productId,
				quantity: req.body.quantity
			})
			return order.save()
		})
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
}

// Delete order
exports.ordersDeleteOrder = (req, res, next) => {
	Order.remove({
			_id: req.params.orderId
		})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Order deleted!",
				request: {
					type: "POST",
					url: "http://localhost:" + PORT + "/orders/",
					body: {
						productId: "Id",
						quantity: "Number"
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
}
