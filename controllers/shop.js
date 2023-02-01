const Product = require('../models/product');

exports.getProducts = (req, res, next) =>
{
  Product.fetchAll().then((products) =>
  {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })

};

exports.getProduct = (req, res, next) =>
{
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) =>
  {
    debugger
    res.render('shop/product-detail', {
      pageTitle: product.title,
      product: product,
      path: '/products'
    })
  })

};

exports.getIndex = (req, res, next) =>
{
  Product.fetchAll().then((products) =>
  {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
};

exports.getCart = (req, res, next) =>
{
  req.user.getCart().then((products) =>
  {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
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
  req.user.deleteProductFromCart(productId).then((result) =>
  {
    res.redirect('/cart')
  })
}

exports.addOrder = (req, res, next) =>
{

  req.user.addOrder().then((result) => { res.redirect('/orders') })
    .catch((error) => console.log(error))
}

exports.getOrders = (req, res, next) =>
{
  req.user.getOrders().then((orders) =>
  {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  }).catch((error) => console.log(error))

};


