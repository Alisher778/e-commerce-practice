const { DataTypes } = require('sequelize');
const sequlize = require('../DB/database');

const Cart = sequlize.define('Cart', {
  clientId: {
    type: DataTypes.INTEGER
  },
  productId: {
    type: DataTypes.INTEGER
  },
  qty: {
    type: DataTypes.INTEGER
  },
  size: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  }
});

module.exports = Cart;