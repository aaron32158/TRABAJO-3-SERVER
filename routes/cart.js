var express = require('express');
var router = express.Router();

const Cart = require('../models/Cart');

const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/', isAuthenticated, (req, res, next) => {

    const cartId = req.use.cart

    Cart.findById(cartId)
        .populate('sneaker')
        .then((foundCart) => {
            if(!foundCart) {
                return res.json({message: 'Your cart is empty'})
            }
            res.json(foundCart)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/create', isAuthenticated, (req, res, next) => {

    const { sneakerId, subtotal, total } = req.body

    

    Cart.create({
        owner: req.user._id,
        subtotal, 
        total,
        // timeLeft: expiry,
        $push: {sneaker: sneakerId}
    })
        .then((createdCart) => {
            res.json(createdCart)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/update', isAuthenticated, (req, res, next) => {

    const { sneakerId, subtotal, total } = req.body

    const cartId = req.user.cart
    
    Cart.findByIdAndUpdate(
        cartId,
        {
            subtotal, 
            total,
            $push: {sneakers: sneakerId}
        },
        { return: true }
    )
        .populate('sneaker')
        .then((updatedCart) => {
            res.json(updatedCart)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/remove-sneaker/:sneakerId', isAuthenticated, (req, res, next) => {

    const cartId = req.user.cart
    const { sneakerId } = req.params

    Cart.findByIdAndUpdate(
        cartId,
        {
            $pull: {sneaker: sneakerId}
        },
        { new: true }
    )
        .populate('sneaker')
        .then((updatedCart) => {
            res.json(updatedCart)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

module.exports = router;