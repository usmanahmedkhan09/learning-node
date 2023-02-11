const mongoose = require('mongoose')
const product = require('./product')

const { Schema } = mongoose

const orderSchema = new Schema({
    user: {
        email: String,
        userId: Schema.Types.ObjectId
    },
    products: [
        { product: { type: Object, required: true }, quantity: { type: Number, required: true } }
    ]
})


module.exports = mongoose.model('Order', orderSchema)