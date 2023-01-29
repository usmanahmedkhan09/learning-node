const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getProducts = (req, res, next) =>
{
  Product.findAll().then((products) =>
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
  Product.findByPk(prodId).then((product) =>
  {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      product: product,
      path: '/products'
    })
  })

};

exports.getIndex = (req, res, next) =>
{
  Product.findAll().then((products) =>
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
  req.user.getCart().then((cart) =>
  {
    return cart.getProducts()
  }).then((products) =>
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
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart().then((cart) =>
  {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: productId } })
  }).then((products) =>
  {
    let product;
    if (products.length > 0)
    {
      product = products[0]
    }
    if (product)
    {
      const oldQuantity = product.cartItem.quantity
      newQuantity = oldQuantity + 1
      return product
      // return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    }
    return Product.findByPk(productId)
  })
    .then((product) =>
    {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then((response) => res.redirect('/cart'))
    .catch((error) => console.log(error))

}

exports.postCartDeleteProduct = (req, res, next) =>
{
  const id = req.body.prodcutId
  Product.getProductById(id, (product) =>
  {
    Cart.deleteProduct(id, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) =>
{
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) =>
{
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
