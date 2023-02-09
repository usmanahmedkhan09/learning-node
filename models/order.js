const mongoose = require('mongoose')

const { Schema } = mongoose

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{ productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, quantity: { type: Number, required: true } }]
})


module.exports = mongoose.model('Order', orderSchema)