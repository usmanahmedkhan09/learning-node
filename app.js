

const path = require('path');
const express = require('express')
const app = express()
const rootDir = require('./util/path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')
const flash = require('connect-flash')


const MONGODB_URI = 'mongodb+srv://usmanahmed:usman123@cluster0.fjrggdo.mongodb.net/shop'

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf()

// const mongoConnect = require('./util/database').MongoConnect

app.use(express.static(path.join(rootDir, 'public')))

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')



const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'node-complete', resave: false, saveUninitialized: false, store: store, }))
app.use(csrfProtection)
app.use(flash())
app.use((req, res, next) =>
{
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) =>
{
    if (!req.session.user)
    {
        return next()
    }
    User.findById(req.session.user._id).then((user) =>
    {
        req.user = user
        next()
    }).catch(err =>
    {
        next(new Error(err))
    })

})



app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get('/500', errorController.get500)
app.use(errorController.get404);

app.use((error, req, res, next) =>
{
    res.render('500',
        {
            pageTitle: 'Error',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        }
    );
})


mongoose.connect(MONGODB_URI)
    .then((result) =>
    {
        app.listen(3000)
    }).catch(err => console.log(err))



