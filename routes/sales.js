const router = require('express').Router();
const sequelize = require('../DB/database');
const Sales = require('../models/sales');
const Products = require('../models/products');
const SoldItems = require('../models/soldItems');

router.get('/', (req, res) => {
  const { userId, userType } = req.session;
  console.log(req.session);

  const SeaerchQuary = sequelize.query(`SELECT * FROM Carts AS MyCart INNER JOIN Products ON Products.id = MyCart.productId WHERE MyCart.clientId = ${userId} `)

  SeaerchQuary
    .then(data => {
      console.log(data);

      res.render('Cart/show', { data: data[0] });
    })
    .catch(err => {
      res.render('partials/error', { error: err.message });
    })

});

router.post('/new', (req, res) => {
  const { userId = 1, userType } = req.session;
  const { customerId, list } = req.body;
  let data = {
    ...req.body,
    customerId: customerId,
    storeId: userType === 'admin' ? userId : customerId,
  }

  Sales
    .create(data)
    .then(sale => {
      // list = [{id, qty, color, salePrice, size, saleId, total}]
      list.forEach(item => {
        SoldItems.create({ ...item, saleId: sale.id });
      })
    })
    .catch(err => res.json(err))
});



module.exports = router;