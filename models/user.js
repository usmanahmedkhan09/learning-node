const mongodb = require('mongodb')
const { getDb } = require('../util/database');

const db = require('../util/database').getDb;

class User
{
    constructor(username, email, cart, id)
    {
        this.username = username
        this.email = email
        this.cart = cart
        this._id = id
    }

    save()
    {
        const db = getDb()
        return db.collection('users').insertOne(this).then((response) =>
        {
            return response
        }).catch((error) =>
        {
            console.log(error)
        })
    }

    addToCart(product)
    {
        const db = getDb()
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
            udpatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })
        }
        let updatedCart = {
            items: udpatedCartItems
        }
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
    }

    getCart()
    {
        const db = getDb()
        const productsIds = this.cart.items.map((item) => item.productId)
        return db.collection('products')
            .find({ _id: { $in: productsIds } })
            .toArray()
            .then((products) =>
            {
                return products.map((p) =>
                {
                    return {
                        ...p,
                        quantity: this.cart.items.find((x) =>
                        {
                            return x.productId.toString() == p._id.toString()
                        }).quantity
                    }
                })
            })
    }

    static findById(userId)
    {
        const db = getDb()
        return db.collection('users').find({ _id: new mongodb.ObjectId(userId) }).next().then(user =>
        {
            return user
        }).catch(error =>
        {
            console.log(error)
        })

    }
}

module.exports = User