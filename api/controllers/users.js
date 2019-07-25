const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// User signup
exports.usersSignUp = (req, res, next) => {
    console.log(req.body.email),
        User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user) {
                console.log(user)
                return res.status(409).json({
                    message: "Email adress exits!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: "User created!",
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.send(500).json({
                error: err
            })
        })
}

// User login
exports.usersLogin = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, pw_check) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed!"
                        })
                    } else {
                        if (pw_check) {
                            console.log(process.env.JWT_KEY)
                            const token = jwt.sign({
                                email: user.email,
                                userId: user._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            })
                            return res.status(200).json({
                                message: "Auth successful!",
                                token: token
                            })
                        }
                        res.status(401).json({
                            message: "Auth failed"
                        })
                    }
                })
            }
        })
        .catch()
}

// Delete user
exports.usersDelete = (req, res, next) => {
    User.deleteOne({
            _id: req.params.userId
        })
        .exec()
        .then(response => {
            res.status(200).json({
                user: response,
                message: "User deleted!"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

}