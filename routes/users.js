var express = require('express');
var router = express.Router();
const Users = require('../models/users');

/* GET users listing. */
router.get('/get', function (req, res, next) {
  Users
    .findAll({})
    .then(data => res.json(data))
    .catch(err => res.send(err))
});

router.get('/profile', (req, res) => {
  res.render('Users/profile');
});


router.put('/:id/edit', function (req, res, next) {
  const { id } = req.params;
  Users
    .update(req.body, { where: { id: 2 } })
    .then(data => res.json(data))
    .catch(err => res.send(err))
});

router.post('/', function (req, res, next) {
  // Users.drop();
  Users
    .create(req.body)
    .then(user => {
      res.json(user)
    }).catch(err => res.send(err))
});

router.delete('/delete-all', (req, res) => {
  Users.drop().then((data) => res.json({ success: true, data })).catch(err => res.send(err))
})

router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  Users
    .destroy({ where: { id } })
    .then(data => res.json(data))
    .catch(err => res.send(err))
});

module.exports = router;
