const { DataTypes } = require('sequelize');
const sequlize = require('../DB/database');

const Sale = sequlize.define('Sale', {
  customerId: {
    type: DataTypes.INTEGER
  },
  total: {
    type: DataTypes.INTEGER
  },
  tax: {
    type: DataTypes.INTEGER
  },
  items: {
    type: DataTypes.INTEGER,
  },
  storeId: {
    type: DataTypes.INTEGER
  }
});

module.exports = Sale;