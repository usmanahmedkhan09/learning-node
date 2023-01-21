const products = []

const getAddProduct = ((req, res, next) =>
{
    res.render('add-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product'
        }
    )

})

const addProduct = ((req, res) =>
{
    products.push({ title: req.body.title })
    res.redirect('/')
})

module.exports = {
    getAddProduct,
    addProduct,
    products
}