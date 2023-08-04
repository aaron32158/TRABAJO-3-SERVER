
const Sneaker = require('../models/Sneaker');

const isSneakerOwner = () => {

    Sneaker.findById(req.params.id)
        .then((foundSneaker) => {
            if (req.body.owner === foundSneaker.owner.toString()) {
                next()
            } else {
                res.status(401).json({message: "Validation Error"})
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
}

module.exports = isSneakerOwner;