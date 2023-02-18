const User = require('../models/user')
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator')
const crypto = require('crypto')


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
    errorMessage: null,
    oldValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });

};

exports.postLogin = (req, res, next) =>
{
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req)
  if (!errors.isEmpty())
  {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldValues: {
        email: email,
        password: password,
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({ email, email })
    .then((user) =>
    {
      if (!user)
      {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: false,
          errorMessage: 'Invalid email or password.',
          oldValues: {
            email: email,
            password: password,
          },
          validationErrors: []
        });
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
          }
          res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            errorMessage: 'Invalid email or password.',
            oldValues: {
              email: email,
              password: password,
            },
            validationErrors: [{ param: 'password', msg: 'invalid password enter' }]
          });
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
  const errors = validationResult(req)
  if (!errors.isEmpty())
  {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldValues: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
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
};

exports.getSignup = (req, res, next) =>
{
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: null,
    oldValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogout = (req, res, next) =>
{
  req.session.destroy((err) =>
  {
    res.redirect('/')
  })
};


exports.getReset = (req, res, next) =>
{
  let message = req.flash('error')
  if (message.length > 0)
  {
    message = message[0]
  } else
  {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
  });
}

exports.postReset = (req, res, next) =>
{
  let email = req.body.email
  const token = crypto.randomBytes(32, (err, buffer) =>
  {
    if (err)
    {
      return res.redirect('/reset')
    }

    const token = buffer.toString('hex')
    User.findOne({ email: email }).then((user) =>
    {
      if (!user)
      {
        req.flash('error', 'No account with that email found!')
        return res.redirect('/reset')
      }
      user.userToken = token
      user.tokenExp = Date.now() + 3600000
      return user.save()

    }).then(() =>
    {
      res.redirect('/')
      return mailer.sendMail({
        to: email,
        from: 'usmanahmedkhan@live.com',
        subject: 'Hi There!',
        html: `
          <p>You requested a password reset<p>
          <p>Click this <a herf="http://localhost:3000/reset/${token}">link</a> to reset password</p>
        `
      })
    })
  })

}

exports.getNewPassword = (req, res, next) =>
{
  const token = req.params.token
  User.findOne(({ userToken: token, tokenExp: { $gt: Date.now() } }))
    .then((user) =>
    {
      let message = req.flash('error')
      if (message.length > 0)
      {
        message = message[0]
      } else
      {
        message = null
      }
      res.render('auth/new-password', {
        path: '/reset',
        pageTitle: 'Update Password',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        userId: user._id.toString(),
        token: token
      });
    }).catch((err) => console.log(err))

}

exports.postNewPassword = (req, res, next) =>
{
  const userId = req.body.userId
  const token = req.body.token
  const newPassword = req.body.password
  let resetUser;
  User.findOne({
    _id: userId,
    userToken: token,
    tokenExp: { $gt: Date.now() }
  }).then((user) =>
  {
    resetUser = user
    return bcrypt.hash(newPassword, 12)
  }).then((hashPassword) =>
  {
    resetUser.password = hashPassword
    resetUser.userToken = undefined
    resetUser.tokenExp = undefined
    return resetUser.save()
  }).then(() =>
  {
    res.redirect('/login')
  }).catch((err) =>
  {
    console.log(err)
  })

}