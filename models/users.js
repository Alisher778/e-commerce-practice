const { DataTypes } = require('sequelize');
const sequlize = require('../DB/database');

const User = sequlize.define('User', {
  address: {
    type: DataTypes.STRING
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  img: {
    type: DataTypes.TEXT
  },
  lang: {
    defaultValue: 'uz',
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.INTEGER
  },
  type: {
    defaultValue: 'customer',
    type: DataTypes.STRING
  },
});

module.exports = User;