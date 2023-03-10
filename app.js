const path = require('path');
const fs = require('fs')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const rootDir = require('./util/path')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')


const errorController = require('./controllers/error');
const shopController = require('./controllers/shop');
const auth = require('./middleware/is-auth')
const User = require('./models/user');


const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@node-practice.ivqzeor.mongodb.net/${process.env.DATABASE_NAME}`

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

const fileLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(helmet)
app.use(compression)
app.use(morgan('combined', { stream: fileLogStream }))
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

app.use(flash());

app.use((req, res, next) =>
{
    // res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.isAuthenticated = req.session.isLoggedIn;
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

app.post('/create-order', auth, shopController.addOrder);

app.use(csrfProtection);
app.use((req, res, next) =>
{
    // res.cookie('XSRF-TOKEN', req.csrfToken())
    res.locals.csrfToken = req.csrfToken();
    next();
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
        app.listen(process.env.PORT || 3000)
    }).catch(err => console.log(err))



