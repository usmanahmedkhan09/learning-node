

const path = require('path');
const express = require('express')
const app = express()
const rootDir = require('./util/path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// const mongoConnect = require('./util/database').MongoConnect

app.use(express.static(path.join(rootDir, 'public')))

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

const adminRoutes = require('./routes/admin')

const shopRoutes = require('./routes/shop');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) =>
{
    User.findById('63e351fda4cd3f057de6151a').then((user) =>
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

mongoose.connect('mongodb+srv://usmanahmed:usman123@cluster0.ozm2t4m.mongodb.net/shop').then((result) =>
{
    User.findOne().then((user) =>
    {
        if (!user)
        {
            const user = new User({
                name: 'usman',
                email: 'usman@gmail.com',
                cart: { items: [] }
            })
            user.save()
        }
    })

    app.listen(3000)
}).catch(err => console.log(err))



