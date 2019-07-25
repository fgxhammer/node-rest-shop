const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')

// POST
// User sign up
router.post('/signup', UsersController.usersSignUp)

// POST
// User login
router.post('/login', UsersController.usersLogin)

// DELETE
// User delete
router.delete('/:userId', UsersController.usersDelete)

module.exports = router