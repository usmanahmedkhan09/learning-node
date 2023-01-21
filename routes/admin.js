
const express = require('express');
const { getAddProduct, addProduct, products } = require('../controllers/products')


const router = express.Router()

// const products = []

router.get('/add-product', getAddProduct)

router.post('/product', addProduct)

exports.routes = router;
exports.products = products;