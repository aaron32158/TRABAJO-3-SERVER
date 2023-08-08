var express = require('express');
var router = express.Router();

const Sneaker = require('../models/Sneaker');
const Comment = require('../models/Comment')

const isAuthenticated = require('../middleware/isAuthenticated');
const isSneakerOwner = require('../middleware/isSneakerOwner')

router.get('/', (req, res, next) => {
  
    Sneaker.find()
        .then((allSneaker) => {
            res.json(allSneaker)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/new-sneaker', isAuthenticated, (req, res, next) => {

    const {  type, image, brand, size, usage, details, material, color, cost, owner } = req.body

    Sneaker.create(
        { 
            type,
            image,
            brand,
            size,
            usage,
            details,
            material,
            color,
            cost,
            owner
        }
        )
        .then((newSneaker) => {
            res.json(newSneaker)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.get('/sneaker-detail/:sneakerId', (req, res, next) => {

    const { sneakerId } = req.params

    Sneaker.findById(sneakerId)
        .populate({
            path: 'comments',
            populate: { path: 'author'}
        })
        .then((foundSneaker) => {
            res.json(foundSneaker)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/sneaker-update/:sneakerId', isAuthenticated, isSneakerOwner, (req, res, next) => {

    const { sneakerId } = req.params

    const { type, image, brand, size, usage, details, material, color, cost, owner } = req.body

    Sneaker.findByIdAndUpdate(
        sneakerId,
        {
            type,
            image,
            brand,
            size,
            usage,
            details,
            material,
            color,
            cost,
            owner
        },
        { new: true}
    )
        .then((updatedSneaker) => {
            res.json(updatedSneaker)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/delete-sneaker/:sneakerId', isAuthenticated, isSneakerOwner, (req, res, next) => {

    const { sneakerId } = req.params

    Sneaker.findByIdAndDelete(sneakerId)
        .then((deletedSneaker) => {
            res.json(deletedSneaker)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/add-comment/:sneakerId', isAuthenticated, (req, res, next) => {

    Comment.create({
        author: req.user._id,
        comment: req.body.comment
    })
        .then((createdComment) => {

            Sneaker.findByIdAndUpdate(
                req.params.sneakerId,
                {
                    $push: {comments: createdComment._id}
                }
            )
            .populate({
                path: 'comments',
                populate: { path: 'author'}
            })
            .then((updatedSneaker) => {
                res.json(updatedSneaker)
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })

        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

module.exports = router;