const Product = require('../models/product');

const { Sequelize } = require('sequelize')

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
  Product.findByPk(productId).then((product) =>
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
  Product.update({ title: updatedTitle, imageUrl: updatedimageUrl, price: updatedPrice, description: updatedDescription }, { where: { id: productId } }).then((response) =>
  {
    res.redirect('/admin/products')
  }).catch((error) => console.log(error))
}

exports.postAddProduct = async (req, res, next) =>
{
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({ title: title, imageUrl: imageUrl, price: price, description: description }).then((response) => [
    res.redirect('/')
  ]).catch((error) => console.log(error))
};

exports.deleteProduct = (req, res, next) =>
{
  const productId = req.params.id;
  Product.destroy({ where: { id: productId } }).then((resposne) =>
  {

    res.redirect('/admin/products')
  }).catch((error) => console.log(error))
}

exports.getProducts = (req, res, next) =>
{
  req.user.getProducts().then((products) =>
  {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
};
