const mongodb = require('mongodb')
const { getDb } = require('../util/database');

const db = require('../util/database').getDb;

class Product
{
  constructor(id, title, imageUrl, price, description, userId)
  {
    this._id = id ? new mongodb.ObjectId(id) : null
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description
    this.userId = userId

  }

  save()
  {
    const db = getDb()
    return db.collection('products').insertOne(this).then((response) =>
    {
    }).catch((error) =>
    {
      console.log(error)
    })
  }

  static fetchAll()
  {
    const db = getDb()
    return db.collection('products').find().toArray().then(products =>
    {
      return products
    }).catch(error =>
    {
      console.log(error)
    })
  }

  static findById(productId)
  {
    const db = getDb()
    return db.collection('products').find({ _id: new mongodb.ObjectId(productId) }).next().then(product =>
    {
      return product
    }).catch(error =>
    {
      console.log(error)
    })

  }

  updateProduct()
  {
    const db = getDb()
    console.log('herere id', this._id)
    return db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this }).then(product =>
    {
      return product
    }).catch(error =>
    {
      console.log(error)
    })
  }

  static deleteProduct(productId)
  {
    const db = getDb()
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(productId) }).then(product =>
    {
      return product
    }).catch(error =>
    {
      console.log(error)
    })
  }
}

module.exports = Product;