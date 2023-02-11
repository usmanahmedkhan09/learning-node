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
      product: product,
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
  Product.findById(productId).then((product) =>
  {
    product.title = updatedTitle
    product.description = updatedDescription
    product.price = updatedPrice
    product.imageUrl = updatedimageUrl
    return product.save()
  }).then((result) =>
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
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user
  })
  product.save().then((response) => res.redirect('/admin/products')).catch((error) => console.log(error))

};

exports.deleteProduct = (req, res, next) =>
{
  const productId = req.params.id;
  Product.findByIdAndRemove(productId).then((resposne) =>
  {
    res.redirect('/admin/products')
  }).catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) =>
{

  Product.find().then((products) =>
  {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  }).catch((error) =>
  {
    console.log(error)
  })
};
