const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const flash = require('express-flash-messages')

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

module.exports = router;
