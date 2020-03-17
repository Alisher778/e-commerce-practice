const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const flash = require('express-flash-messages');
const nodemail = require('../utils/email');
const path = require('path');

/* GET home page. */
router.get('/sign-in', (req, res, next) => {
  res.render('Auth/signIn');
});

router.post('/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  Users
    .findAll({ where: { email, type: 'customer' } })
    .then(async (user) => {
      if (user.length) {
        const currentUser = user[0];
        const hashedPassword = await bcrypt.compare(req.body.password, currentUser.password);
        if (hashedPassword) {
          req.session.userId = currentUser.id;
          req.session.userType = currentUser.type;
          req.session.email = currentUser.email;
          req.session.name = currentUser.name;

          res.redirect('/');
        } else {
          req.flash('error', 'Email/password is wrong');
          res.redirect('/auth/sign-in');
        }
      } else {
        req.flash('error', 'The account does not exist');
        res.redirect('/auth/sign-in');
      }


    })
    .catch(err => console.log(err))
});


router.get('/sign-up', (req, res, next) => {
  res.render('Auth/signUp');
});

router.post('/sign-up', async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 8);

  Users
    .create({ ...req.body, password: hash })
    .then((data) => {
      req.session.userId = data.id;
      req.session.userType = data.type;
      req.session.email = data.email;
      req.session.name = data.name;

      res.redirect('/');
    })
    .catch(err => {
      const errors = err.errors.map(item => item.message);
      req.flash('error', errors);
      res.redirect('/auth/sign-up');
    })
});


/* ======================================================
---------------------- ADMIN  --------------------------
====================================================== */

router.get('/store/', (req, res, next) => {
  res.render('Auth/admin');
});


router.get('/store/sign-in', (req, res, next) => {
  res.render('Auth/admin/signIn');
  console.log('Admin path');
});

router.post('/store/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  Users
    .findAll({ where: { email: email, type: 'admin' } })
    .then(async (user) => {

      if (user.length) {
        const currentUser = user[0];
        const hashedPassword = await bcrypt.compare(req.body.password, currentUser.password);
        if (hashedPassword) {
          req.session.userId = currentUser.id;
          req.session.userType = currentUser.type;
          req.session.email = currentUser.email;
          req.session.name = currentUser.name;

          res.redirect('/');
        } else {
          req.flash('error', 'Email or password is wrong');
          res.redirect('/auth/store/sign-in');
        }
      } else {
        req.flash('error', 'The account does not exist');
        res.redirect('/auth/store/sign-in');
      }

    })
    .catch(err => {
      const errors = err.errors.map(item => item.message);
      req.flash('error', errors);
      res.redirect('/auth/store/sign-up');
    })
});

router.get('/store/sign-up', (req, res, next) => {
  res.render('Auth/admin/signUp');

});

router.post('/store/sign-up', async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 8);

  Users
    .create({ ...req.body, password: hash, type: 'admin' })
    .then((data) => {
      req.session.userId = data.id;
      req.session.userType = data.type;
      req.session.email = data.email;
      req.session.name = data.name;

      res.redirect('/');
    })
    .catch(err => {
      const errors = err.errors.map(item => item.message);
      req.flash('error', errors);
      res.redirect('/auth/store/sign-up');
    })
});


router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/sign-in');
});

router.get('/forgot-password', (req, res) => {
  const { email } = req.query;
  if (email) {
    Users
      .findAll({ where: { email } })
      .then(docs => {

        if (docs[0].resetToken >= Date.now()) {
          res.render('Auth/reset');
        } else {
          req.flash('error', 'Sorry the reset time expired. Try again later!');
          res.redirect('/auth/forgot-password');
        }
      })
  } else {
    res.render('Auth/forgot');
  }

});

router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 8);
  Users
    .findAll({ where: { email } })
    .then(docs => {
      docs[0].password = hash;
      docs[0].resetToken = null;
      return docs[0].save();
    })
    .then(data => {
      req.flash('success', 'Your password has been updated successfully!');
      res.redirect('/auth/sign-in');
    })
    .catch(err => {
      req.flash('error', err.message);
      res.redirect('/auth/forgot-password');
    })

});


router.post('/forgot-password', (req, res) => {

  const { email } = req.body;
  const thirtyMinsFromNow = Date.now() + (60 * 30 * 1000);

  Users
    .findAll({ where: { email } })
    .then(docs => {
      if (docs.length) {
        docs[0].resetToken = thirtyMinsFromNow.toString();
        return docs[0].save();

      } else {
        req.flash('error', 'There is no an account with the email address ' + email);
        res.redirect('/auth/forgot-password');
      }
    })
    .then(() => {
      const thirtyMinsFromNow = Date.now() + (60 * 30 * 1000);
      const resetUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '?email=' + email + '&token=' + thirtyMinsFromNow;

      var message = {
        from: "sender@server.com",
        to: email,
        subject: "Reset your password",
        text: "Plaintext version of the message",
        html: `
            <h2>Use the link to reset your password</h2>
            <em>Note: the link expires in <b>30</b> mins</em>
            <a href=${resetUrl}>Rest Now</a>
          `,
      };

      return nodemail
        .sendMail(message)
        .then(msg => {
          req.flash('success', 'Check your email"' + email + '"for resetting your passsword')
          res.redirect('/auth/forgot-password');
        })
    }).catch(err => {
      req.flash('error', err.message);
      res.redirect('/auth/forgot-password');
    })

























});


module.exports = router;
