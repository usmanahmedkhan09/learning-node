const path = require('path');

const express = require('express');
const { body } = require('express-validator')

const adminController = require('../controllers/admin');
const auth = require('../middleware/is-auth')

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', auth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', auth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', auth,
    [
        body('title').isString().isLength({ min: 5 }).withMessage('Please enter a valid title.').trim(),
        body('imageUrl').isURL().withMessage('Please enter a valid url.'),
        body('price').isFloat().withMessage('Please enter a valid price.'),
        body('description').isLength({ min: 5, max: 500 }).withMessage('Please enter a valid description and it should between 5 to 500 characters.').trim()
    ],
    adminController.postAddProduct);

// /admin/edit-product => POST
router.get('/edit-product/:productId',

    auth, adminController.getEditProduct);

router.post('/edit-product', auth, adminController.postEditProduct);

router.post('/delete-product/:id',
    [
        body('title').isString().isLength({ min: 5 }).withMessage('Please enter a valid title.').trim(),
        body('imageUrl').isURL().withMessage('Please enter a valid url.'),
        body('price').isFloat().withMessage('Please enter a valid price.'),
        body('description').isLength({ min: 5, max: 500 }).withMessage('Please enter a valid description and it should between 5 to 500 characters.').trim()
    ],
    auth, adminController.deleteProduct);

module.exports = router;
