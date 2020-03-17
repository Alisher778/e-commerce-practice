const router = require('express').Router();
const sequelize = require('../DB/database');
const Cart = require('../models/cart');
const Products = require('../models/products');

router.get('/', (req, res) => {
  const { userId, userType } = req.session;
  console.log(req.session);

  const SearchQuary = sequelize.query(`SELECT * FROM Carts AS MyCart INNER JOIN Products ON Products.id = MyCart.productId WHERE MyCart.clientId = ${userId} `)

  SearchQuary
    .then(data => {
      res.render('Cart/show', { data: data[0] });
    })
    .catch(err => {
      res.render('partials/error', { error: err.message });
    })

});

router.get('/get-cart-info', (req, res) => {
  const { userId, userType } = req.session;
  const SearchQuary = sequelize.query(`SELECT * FROM Carts AS MyCart INNER JOIN Products ON Products.id = MyCart.productId WHERE MyCart.clientId = ${userId} `)
  console.log(SearchQuary);

  SearchQuary
    .then(data => {
      res.json({ data: data[0], success: true });
      console.log(data[0]);

    })
    .catch(err => {
      res.json({ error: err.message, success: false });
    })

});

router.get('/new', (req, res) => {
  res.render('products/new');
});

router.post('/new', (req, res) => {
  const { userId = 1 } = req.session;
  let data = { ...req.body, clientId: userId }

  Cart
    .create(data)
    .then(data => {

      res.json({ success: true, data });
    })
    .catch(err => res.json(err))
});



module.exports = router;