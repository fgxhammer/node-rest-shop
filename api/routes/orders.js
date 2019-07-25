const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')

const OrdersController = require('../controllers/orders')

//DEV
const PORT = 3000

//Get all orders
router.get('/', checkAuth, OrdersController.ordersGetAll)

//Get order by id
router.get('/:orderId', checkAuth, OrdersController.ordersGetOne)

// Create new order
router.post('/', checkAuth, OrdersController.ordersCreateOrder)

//Delete order by id
router.delete('/:orderId', checkAuth, OrdersController.ordersDeleteOrder)

module.exports = router