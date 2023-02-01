const mongodb = require('mongodb')
const Product = require('../models/product');



exports.getAddProduct = (req, res, next) =>
{
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) =>
{
  const editMode = req.query.editMode
  if (!editMode)
  {
    return res.redirect('/')
  }
  const productId = req.params.productId
  Product.findById(productId).then((product) =>
  {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })

};

exports.postEditProduct = (req, res, next) =>
{
  const productId = req.body.productId
  const updatedTitle = req.body.title
  const updatedDescription = req.body.description
  const updatedPrice = req.body.price
  const updatedimageUrl = req.body.imageUrl
  const product = new Product(productId, updatedTitle, updatedimageUrl, updatedPrice, updatedDescription)
  product.updateProduct().then((product) =>
  {
    res.redirect('/admin/products')
  })
}

exports.postAddProduct = async (req, res, next) =>
{
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, price, description, req.user._id)
  product.save().then((response) => res.redirect('/admin/products')).catch((error) => console.log(error))

};

exports.deleteProduct = (req, res, next) =>
{
  const productId = req.params.id;
  Product.deleteProduct(productId).then((resposne) =>
  {

    res.redirect('/admin/products')
  }).catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) =>
{

  Product.fetchAll().then((products) =>
  {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch((error) =>
  {
    console.log(error)
  })
};
