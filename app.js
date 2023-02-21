

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const rootDir = require('./util/path')
const multer = require('multer')


const errorController = require('./controllers/error');
const User = require('./models/user');


const MONGODB_URI = 'mongodb+srv://usmanahmed:usman123@cluster0.ozm2t4m.mongodb.net/shop'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
// const csrfProtection = csrf();
const csrfProtection = csrf();

const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, 'images')
    },
    filename: function (req, file, cb)
    {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
})

const fileFilter = (req, file, cb) =>
{
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    )
    {
        cb(null, true);
    } else
    {
        cb('invalid file', false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    multer({ storage: storage, }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) =>
{
    // res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) =>
{
    // throw new Error('Sync Dummy');

    if (!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user =>
        {
            if (!user)
            {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err =>
        {
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) =>
{
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        // isAuthenticated: req.session.isLoggedIn
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) =>
    {
        app.listen(3000)
    }).catch(err => console.log(err))



