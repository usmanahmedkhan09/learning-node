

const path = require('path');
const express = require('express')
const app = express()
const rootDir = require('./util/path')
const bodyParser = require('body-parser')

const db = require('./util/database')

app.use(express.static(path.join(rootDir, 'public')))

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

const adminRoutes = require('./routes/admin')

const shopRoutes = require('./routes/shop')

const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Product.belongsToMany(Cart, { through: CartItem })
Cart.belongsToMany(Product, { through: CartItem })


app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) =>
{
    User.findByPk(1).then((user) =>
    {
        req.user = user
        next()
    })
})


app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use((req, res) =>
{
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' })
})

db.sync().then((response) =>
{
    return User.findByPk(1)
}).then((user) =>
{
    if (!user)
    {
        User.create({ name: 'usman', email: 'usman@gmail.com' })
    }
    return user
}).then((user) =>
{
    return user.createCart()
}).then((resposne) =>
{
    app.listen(3000)
}).catch((error) => console.log(error))

