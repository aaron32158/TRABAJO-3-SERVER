var express = require('express');
var router = express.Router();

const Cart = require('../models/Cart');

const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/', isAuthenticated, (req, res, next) => {

    Cart.findOne({
        owner: req.user._id
    })
        .populate('sneakers')
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

router.post('/create', isAuthenticated, async (req, res, next) => {

    try {

        const { sneakerId, sneakerCost } = req.body
    
        const newCart = await Cart.create({
            owner: req.user._id,
            subtotal: sneakerCost, 
            total: sneakerCost + 10,
            sneakers: [sneakerId]
        })
    
        const populated = await newCart.populate('sneakers')

        console.log("POPULATED ====>", populated)
    
            res.json(populated)

    } catch (err) {
        
        res.json(err)
        console.log(err)
        next(err)

    }

})

router.post('/update', isAuthenticated, async (req, res, next) => {

    try {

        const { sneakerId, cartId, sneakerCost } = req.body

        const toUpdate = await Cart.findById(cartId)
    
        toUpdate.subtotal += sneakerCost
        toUpdate.total = toUpdate.subtotal + 10
        toUpdate.sneakers.push(sneakerId)

        const newCart = await toUpdate.save()
    
        const populated = await newCart.populate('sneakers')
    
            res.json(populated)

    } catch (err) {
        
        res.redirect(307, '/cart/create')
        console.log(err)
        next(err)
    }

})

router.post('/remove-sneaker/:sneakerId', isAuthenticated, async (req, res, next) => {
    

    try {

        const cartId = req.body._id
        
        const { sneakerId } = req.params

        console.log("SNEAKERID ===>", sneakerId)

        const toPopulate = await Cart.findById(cartId)

        const cart = await toPopulate.populate('sneakers')

        console.log("Cart ===>", cart)

        let sneaker = cart.sneakers.find((thisSneaker) => thisSneaker._id.toString() === sneakerId)

        console.log("Sneaker ====>", sneaker)
        
        let remainingSneakers = cart.sneakers.filter((sneaker) => sneaker._id.toString() !== sneakerId)

        cart.sneakers = remainingSneakers
        cart.subtotal -= sneaker.cost
        cart.total = cart.subtotal + cart.shipping

        let newCart = await cart.save()

        console.log("New cart ===>", newCart)

        res.json(newCart)

    } catch (err) {

        res.json(err)
        console.log(err)
        next(err)
    }

  })

module.exports = router;