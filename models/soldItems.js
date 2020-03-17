const { DataTypes } = require('sequelize');
const sequlize = require('../DB/database');

const SoldItems = sequlize.define('SoldItems', {
  saleId: {
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
  salePrice: {
    type: DataTypes.STRING,
  },
  total: {
    type: DataTypes.STRING,
  }
});

module.exports = SoldItems;