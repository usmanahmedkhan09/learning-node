const Product = require('../models/product');

exports.getAddProduct = (req, res, next) =>
{
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
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
  Product.getProductById(productId, (product) =>
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
  const updatedproduct = new Product(productId, updatedTitle, updatedimageUrl, updatedDescription, updatedPrice)
  updatedproduct.save()
  res.redirect('/admin/products')

}

exports.postAddProduct = (req, res, next) =>
{
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) =>
{
  Product.fetchAll(products =>
  {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
