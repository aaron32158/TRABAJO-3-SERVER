const { Schema, model } = require('mongoose');

const sneakerSchema = new Schema(
    {
        type: String,
        image: String,
        brand: String,
        size: String,
        usage: String,
        details: String,
        material: String,
        color: String,
        cost: {
            type: Number,
            default: 0
        },
        owner: { type: Schema.Types.ObjectId, ref: 'User' },

        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    },
    {
        timeseries: true
    }
)

module.exports = model('Sneaker', sneakerSchema)