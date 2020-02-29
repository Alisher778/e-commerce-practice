const { DataTypes } = require('sequelize');
const sequlize = require('../DB/database');

const Sales = sequlize.define('Sale', {
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

module.exports = Sales;