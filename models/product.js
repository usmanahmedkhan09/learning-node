const fs = require('fs');
const path = require('path');
const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb =>
{
  fs.readFile(p, (err, fileContent) =>
  {
    if (err)
    {
      cb([]);
    } else
    {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product
{
  constructor(id, title, imageUrl, description, price)
  {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save()
  {
    getProductsFromFile(products =>
    {
      if (this.id)
      {
        let existingProductIndex = products.findIndex((product) => product.id == this.id)
        let udpatedProducts = [...products]
        udpatedProducts[existingProductIndex] = this
        fs.writeFile(p, JSON.stringify(udpatedProducts), err =>
        {
          console.log(err);
        });

      } else
      {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err =>
        {
          console.log(err);
        });
      }

    });


  }

  static fetchAll(cb)
  {
    getProductsFromFile(cb);
  }

  static getProductById(productId, cb)
  {
    getProductsFromFile(products =>
    {
      const prod = products.find(product => product.id == productId)
      cb(prod)
    })
  }

  static deleteProduct(productId)
  {
    getProductsFromFile(products =>
    {
      const productIndex = products.findIndex((product) => product.id == productId)
      const product = products[productIndex]
      if (productIndex != -1)
      {
        products.splice(productIndex, 1)
      }
      fs.writeFile(p, JSON.stringify(products), err =>
      {
        Cart.deleteProduct(productId, product.price)
        console.log(err);
      });
    })
  }
};
