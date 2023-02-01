

const path = require('path');
const express = require('express')
const app = express()
const rootDir = require('./util/path')
const bodyParser = require('body-parser')

const mongoConnect = require('./util/database').MongoConnect

app.use(express.static(path.join(rootDir, 'public')))

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

const adminRoutes = require('./routes/admin')

const shopRoutes = require('./routes/shop');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) =>
{
    User.findById('63da01f2d1b01cc5ac36a28a').then((user) =>
    {
        req.user = new User(user.username, user.email, user.cart, user._id)
        next()
    })

})


app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use((req, res) =>
{
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' })
})


mongoConnect((req, res, next) =>
{
    app.listen(3000)
})


