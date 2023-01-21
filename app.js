

const path = require('path');
const express = require('express')
const app = express()
const rootDir = require('./util/path')
const bodyParser = require('body-parser')

app.use(express.static(path.join(rootDir, 'public')))

const adminRoutes = require('./routes/admin')

const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))



app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

app.use('/admin', adminRoutes.routes)
app.use(shopRoutes)


app.use((req, res) =>
{
    res.status(404).render('404', { pageTitle: 'Page Not Found' })
})

app.listen(3000)