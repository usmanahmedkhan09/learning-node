const mongoose = require('mongoose');
const { Schema } = mongoose;

const Order = require('./order')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userToken: String,
    tokenExp: Date,
    cart: {
        items: [{ productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, quantity: { type: Number, required: true } }]
    }
})

userSchema.methods.addToCart = function (product)
{

    const cartProductIndex = this.cart.items.findIndex((item) =>
    {
        return item.productId.toString() == product._id.toString()
    })
    let newQuantity = 1
    const udpatedCartItems = [...this.cart.items]

    if (cartProductIndex >= 0)
    {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        udpatedCartItems[cartProductIndex].quantity = newQuantity
    } else
    {
        udpatedCartItems.push({ productId: product._id, quantity: newQuantity })
    }
    let updatedCart = {
        items: udpatedCartItems
    }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.removeProductFromCart = function (productId)
{
    const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() != productId.toString())
    this.cart = updatedCartItems
    return this.save()
}

userSchema.methods.clearCart = function ()
{
    this.cart = { items: [] }
    return this.save()
}

module.exports = mongoose.model('User', userSchema)
// const { response } = require('express');
// const mongodb = require('mongodb')
// const { getDb } = require('../util/database');

// const db = require('../util/database').getDb;

// class User
// {
//     constructor(username, email, cart, id)
//     {
//         this.username = username
//         this.email = email
//         this.cart = cart
//         this._id = id
//     }

//     save()
//     {
//         const db = getDb()
//         return db.collection('users').insertOne(this).then((response) =>
//         {
//             return response
//         }).catch((error) =>
//         {
//             console.log(error)
//         })
//     }

//     addToCart(product)
//     {
//         const db = getDb()
//         const cartProductIndex = this.cart.items.findIndex((item) =>
//         {
//             return item.productId.toString() == product._id.toString()
//         })
//         let newQuantity = 1
//         const udpatedCartItems = [...this.cart.items]

//         if (cartProductIndex >= 0)
//         {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1
//             udpatedCartItems[cartProductIndex].quantity = newQuantity
//         } else
//         {
//             udpatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
//         }
//         let updatedCart = {
//             items: udpatedCartItems
//         }
//         return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
//     }

//     getCart()
//     {
//         const db = getDb()
//         const productsIds = this.cart.items.map((item) => item.productId)
//         return db.collection('products')
//             .find({ _id: { $in: productsIds } })
//             .toArray()
//             .then((products) =>
//             {
//                 return products.map((p) =>
//                 {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find((x) =>
//                         {
//                             return x.productId.toString() == p._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//     }

//     deleteProductFromCart(productId)
//     {
//         const db = getDb()
//         const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() != productId.toString())
//         return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } })
//     }

//     addOrder()
//     {
//         const db = getDb()
//         return this.getCart((products) =>
//         {
//             return products
//         }).then((products) =>
//         {
//             let order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.username,
//                     email: this.email
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(() =>
//         {
//             return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } })

//         })
//     }

//     getOrders()
//     {
//         const db = getDb()
//         return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray()
//     }

//     static findById(userId)
//     {
//         const db = getDb()
//         return db.collection('users').find({ _id: new mongodb.ObjectId(userId) }).next().then(user =>
//         {
//             return user
//         }).catch(error =>
//         {
//             console.log(error)
//         })

//     }
// }

// module.exports = User