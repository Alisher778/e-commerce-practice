const { DataTypes } = require('sequelize');
const sequlize = require('../DB/database');

const Products = sequlize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER
  },
  img: {
    type: DataTypes.TEXT,
    defaultValue: '/images/default-product.webp'
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DOUBLE
  },
  salePrice: {
    type: DataTypes.DOUBLE
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitType: {
    type: DataTypes.STRING,
    defaultValue: 'piece'
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Products;