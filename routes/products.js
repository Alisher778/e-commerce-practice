const router = require('express').Router();
const Products = require('../models/products');
const multer = require('../utils/multer');
console.log(multer);


router.get('/', (req, res) => {
  Products
    .findAll()
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
  const { filename } = req.file;

  Products
    .create({ ...req.body, storeId: userId, img: '/uploads/products/' + filename })
    .then(data => {
      res.redirect('/products');
    })
    .catch(err => res.json(err))
});

module.exports = router;