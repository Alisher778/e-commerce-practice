const router = require('express').Router();
const Products = require('../models/products');
const multer = require('../utils/multer');
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const { userId, userType } = req.session;
  let query = {};
  if (userType === 'admin') {
    query = { where: { storeId: userId } }
  }

  Products
    .findAll(query)
    .then(data => {
      res.render('products/index', { data });
    })
    .catch(err => {
      res.render('partials/error', { error: err.message });
    })

});

router.get('/new', (req, res) => {
  res.render('products/new');
});

router.post('/new', multer.single('img'), (req, res) => {
  const { userId = 1 } = req.session;
  let data = {};
  if (req.file) {
    const { filename } = req.file;
    data = { ...req.body, storeId: userId, img: '/uploads/products/' + filename }
  } else {
    data = { ...req.body, storeId: userId }
  }


  Products
    .create(data)
    .then(data => {
      res.redirect('/products');
    })
    .catch(err => res.json(err))
});


// --------------- EDIT PRODUCT ----------------

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Products
    .findByPk(id)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.render('Partials/error', { error: err.message }))

});
router.get('/:id/edit', (req, res) => {
  const { id } = req.params;

  Products
    .findByPk(id)
    .then(data => {
      res.render('products/edit', { data });
    })
    .catch(err => res.render('Partials/error', { error: err.message }))

});

router.get('/:id/delete', (req, res) => {
  const { id } = req.params;

  Products
    .findByPk(id)
    .then(data => {

      data
        .destroy()
        .then(() => {
          res.redirect('/products');
          fs
            .unlink(path.join(__dirname, '../public', data.img), (err, data) => {
              if (err) {
                console.log(err)
              } else {
                console.log('Removed the old image')
              }
            })
        })
        .catch(err => res.render('Partials/error', { error: err.message }))

    })
    .catch(err => res.render('Partials/error', { error: err.message }))

});

router.post('/:id/edit', multer.single('img'), (req, res) => {
  const { userId = 1 } = req.session;
  const { id } = req.params;

  Products
    .findByPk(id)
    .then(data => {
      let oldImg = data.img;
      if (req.file) {
        oldImg = '/uploads/products/' + req.file.filename;
        fs
          .unlink(path.join(__dirname, '../public', data.img), (err, data) => {
            if (err) {
              console.log(err)
            } else {
              console.log('Removed the old image')
            }
          })

      }
      data.update({ ...req.body, img: oldImg }).then(data => {
        res.redirect('/products');
      })
        .catch(err => res.render('products/edit', { data }))
    })
    .catch(err => res.render('Partials/error', { error: err.message }))

});

module.exports = router;