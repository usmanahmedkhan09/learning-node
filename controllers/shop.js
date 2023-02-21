const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path')
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.getProducts = (req, res, next) =>
{
  Product.find().then((products) =>
  {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  })

};

exports.getProduct = (req, res, next) =>
{
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) =>
  {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      product: product,
      path: '/products',
    })
  })

};

exports.getIndex = (req, res, next) =>
{
  Product.find().then((products) =>
  {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  })
};

exports.getCart = (req, res, next) =>
{
  req.user.populate('cart.items.productId').then((user) =>
  {
    const products = user.cart.items
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  })
};

exports.postCart = (req, res, next) =>
{
  const productId = req.body.productId
  Product.findById(productId).then((product) =>
  {
    return product
  }).then((product) =>
  {
    req.user.addToCart(product).then(() =>
    {
      res.redirect('/cart')
    })
  })

}

exports.postCartDeleteProduct = (req, res, next) =>
{
  const productId = req.body.productId
  req.user.removeProductFromCart(productId).then((result) =>
  {
    res.redirect('/cart')
  })
}

exports.addOrder = (req, res, next) =>
{
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user =>
    {
      const products = user.cart.items.map(i =>
      {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result =>
    {
      return req.user.clearCart();
    })
    .then(() =>
    {
      res.redirect('/orders');
    })
    .catch(err =>
    {

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });


}

exports.getOrders = (req, res, next) =>
{
  Order.find({ 'user.userId': req.user._id })
    .then(orders =>
    {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err =>
    {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getInvoice = (req, res, next) =>
{
  const orderId = req.params.orderId
  Order.findById(orderId).then(order =>
  {
    if (order.user.userId.toString() != req.user._id)
    {
      return next(new Error('No order found.'))
    }
    if (order.user.userId.toString() != req.user._id.toString())
    {
      return next(new Error('Unauthorized'))
    }
    const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoicePath = path.join('data', 'invoice', invoiceName)
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.text('-----------------------');
    let totalPrice = 0;
    order.products.forEach(prod =>
    {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
          ' - ' +
          prod.quantity +
          ' x ' +
          '$' +
          prod.product.price
        );
    });
    pdfDoc.text('---');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();
  }).catch()

}