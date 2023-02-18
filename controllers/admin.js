const mongodb = require('mongodb')
const Product = require('../models/product');
const user = require('../models/user');
const { validationResult } = require('express-validator')



exports.getAddProduct = (req, res, next) =>
{
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: null,
    oldValues: {
      title: '',
      imageUrl: '',
      price: '',
      description: ''
    },
    hasError: false,
    validationErrors: []
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
      errorMessage: null,
      oldValues: {
        title: '',
        imageUrl: '',
        price: '',
        description: ''
      },
      hasError: false,
      validationErrors: []
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
  const errors = validationResult(req)
  if (!errors.isEmpty())
  {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Edit Product',
      isAuthenticated: false,
      editing: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: updatedTitle,
        imageUrl: updatedimageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: productId
      },
      hasError: true,
      validationErrors: errors.array()
    });
  }
  Product.findById(productId).then((product) =>
  {
    if (product.userId.toString() != req.user._id.toString())
    {
      res.redirect('/admin/products')
    }
    product.title = updatedTitle
    product.description = updatedDescription
    product.price = updatedPrice
    product.imageUrl = updatedimageUrl
    return product.save().then((result) =>
    {
      res.redirect('/admin/products')
    })
  }).catch((err) =>
  {
    console.log(err)
  })

}

exports.postAddProduct = async (req, res, next) =>
{
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req)
  if (!errors.isEmpty())
  {
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      isAuthenticated: false,
      editing: false,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      hasError: true,
      validationErrors: errors.array()
    });
  }
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
  Product.deleteOne({ _id: productId, userId: req.user._id }).then((resposne) =>
  {
    res.redirect('/admin/products')
  }).catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) =>
{

  Product.find({ userId: req.user._id }).then((products) =>
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
