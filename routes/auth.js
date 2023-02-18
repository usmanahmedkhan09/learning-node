const { response } = require('express');
const express = require('express');
const { check, body } = require('express-validator')


const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', [check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email.'),
body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
]
    , authController.postLogin)

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail()
            .custom((value, req) =>
            {
                return User.findOne({ email: value }).then((user) =>
                {
                    if (user)
                    {
                        return Promise.reject('E-mail already in use');
                    }
                })
            }),
        body('password', 'Please enter a password with only text and numbers and atleast 5 charcaters')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').trim().custom((value, { req }) =>
        {
            if (value != req.body.password)
            {
                throw new Error('Confirm password does not match with password')
            }
            return true
        })],
    authController.postSignup);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.get('/new-password', authController.postNewPassword)

module.exports = router;