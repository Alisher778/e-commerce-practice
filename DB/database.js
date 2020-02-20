const Sequelize = require('sequelize');

const sequelize = new Sequelize('bazar', 'user', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Succesfully loaded'))
  .catch(err => {
    console.log(err)
  });


sequelize.sync().then(() => console.log('Successs')).catch(err => console.log('-------', err))

module.exports = sequelize;