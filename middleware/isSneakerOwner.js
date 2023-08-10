const Sneaker = require('../models/Sneaker');

const isSneakerOwner = (req, res, next) => {
  Sneaker.findById(req.params.sneakerId)
    .then((foundSneaker) => {
      if (!foundSneaker) {
        return res.status(404).json({ message: "Sneaker not found" });
      }
      
      if (req.body.owner === foundSneaker.owner.toString()) {
        next();
      } else {
        res.status(401).json({ message: "Validation Error" });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = isSneakerOwner;
