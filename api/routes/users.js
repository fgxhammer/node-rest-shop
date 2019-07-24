const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')


// POST
router.post('/signup', (req, res, next) => {
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
})

// DELETE
router.delete('/:userId', (req, res, next) => {
    User.deleteOne({
            _id: req.params.userId
        })
        .exec()
        .then(response => {
            res.status(200).json({
                message: "User deleted!"
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