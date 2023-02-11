const User = require('../models/user')
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');


const options = {
  auth: {
    api_key: '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'
  }
}

const mailer = nodemailer.createTransport(sendGridTransport(options));

exports.getLogin = (req, res, next) =>
{
  let message = req.flash('error')
  if (message.length > 0)
  {
    message = message[0]
  } else
  {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
  });


};

exports.postLogin = (req, res, next) =>
{
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email, email })
    .then((user) =>
    {
      if (!user)
      {
        req.flash('error', 'invalid login or password')
        return res.redirect('/login');
      } else
      {
        bcrypt.compare(password, user.password).then((doMatch) =>
        {
          if (doMatch)
          {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((err) =>
            {
              res.redirect('/')
            })
          } else
          {
            return res.redirect('/login')
          }
        }).catch((err) =>
        {
          res.redirect('/login')
        })
      }
    }).catch((err) => console.log(err))
};

exports.postSignup = (req, res, next) =>
{
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  User.findOne({ email: email }).then((user) =>
  {
    if (user)
    {
      return res.redirect('/')
    } else
    {
      return bcrypt.hash(password, 12)
        .then((hashPassword) =>
        {
          const user = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(() =>
        {
          res.redirect('/login')
          return mailer.sendMail({
            to: email,
            from: 'usmanahmedkhan@live.com',
            subject: 'Hi There!',
            text: 'Awesome sauce',
            html: '<b>Awesome sauce</b>'
          })
        }).catch((err) => console.log(err))

    }
  })
    .catch((err) => console.log(err))
};

exports.getSignup = (req, res, next) =>
{
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogout = (req, res, next) =>
{
  req.session.destroy((err) =>
  {
    res.redirect('/')
  })
};
