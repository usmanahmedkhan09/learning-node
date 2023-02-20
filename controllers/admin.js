const mongodb = require('mongodb')
const Product = require('../models/product');
const user = require('../models/user');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');



exports.getAddProduct = (req, res, next) =>
{
  return res.render('admin/edit-product', {
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
    return res.render('admin/edit-product', {
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
  }).catch((err) =>
  {
    const error = new Error()
    error.httpStatusCode = 500
    return next(error)
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
    const error = new Error()
    error.httpStatusCode = 500
    return next(error)
  })

}

exports.postAddProduct = (req, res, next) =>
{
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image)
  {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty())
  {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result =>
    {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err =>
    {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) =>
{
  const productId = req.params.id;
  Product.deleteOne({ _id: productId, userId: req.user._id }).then((resposne) =>
  {
    res.redirect('/admin/products')
  }).catch((err) =>
  {
    const error = new Error()
    error.httpStatusCode = 500
    return next(error)
  })
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
  }).catch((err) =>
  {
    const error = new Error()
    error.httpStatusCode = 500
    return next(error)
  })
};
