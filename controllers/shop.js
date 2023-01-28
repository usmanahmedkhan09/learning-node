const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) =>
{
  Product.fetchAll(products =>
  {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) =>
{
  const prodId = req.params.productId;
  Product.getProductById(prodId, (product) =>
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
  Product.fetchAll(products =>
  {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) =>
{
  Cart.getCart(cart =>
  {
    Product.fetchAll(products =>
    {
      const CartProducts = []
      for (product of products)
      {
        const cartProduct = cart.products.find((item) => item.id == product.id)
        if (cartProduct)
        {
          CartProducts.push({ productData: product, qty: cartProduct.qty })
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: CartProducts
      });
    })
  })

};

exports.postCart = (req, res, next) =>
{
  const productId = req.body.productId
  Product.getProductById(productId, (product) =>
  {
    Cart.addProduct(productId, product.price)
    res.redirect('/cart')
  })

}

exports.postCartDeleteProduct = (req, res, next) =>
{
  const id = req.body.prodcutId
  Product.getProductById(id, (product) =>
  {
    Cart.deleteProduct(id, product.price)
    res.redirect('/cart')
  })
  // console.log(id)
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
