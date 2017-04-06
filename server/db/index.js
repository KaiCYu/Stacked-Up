const mysql = require('mysql');

// Create a database connection and export it from this file.
exports.connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'StackedUp',
});

exports.connection.connect();
