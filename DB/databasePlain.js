const mysql = require('mysql');

const connection = mysql.createConnection({
  user: ' root',
  password: '',
  host: 'localhost',
  database: 'bazar'
});

connection.connect((err, result) => {
  if (err) throw err;

  console.log('Database is loaded')
});

module.exports = connection;