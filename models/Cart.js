const { Schema, model } = require('mongoose');

const cartSchema = new Schema(
    {
        sneaker: [{type: Schema.Types.ObjectId, ref: 'Sneaker'}],
        subtotal: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0.08
        },
        total: {
            type: Number,
            default: 0
        },
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        // timeLeft: Date
    },
    {
        // timeseries: true,
        createdAt: { type: Date, expires: '2m', default: Date.now }
    }
)

module.exports = model('Cart', cartSchema)