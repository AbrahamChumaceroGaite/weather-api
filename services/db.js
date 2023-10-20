const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: 'cljf4js2800mznqd6o8b43qyk',
  user: 'root',
  password: 'password@2022',
  database: 'monitor'
});

module.exports = connection;
