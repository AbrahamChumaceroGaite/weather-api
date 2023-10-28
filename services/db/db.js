const mysql = require("mysql2");

/* const connection = mysql.createConnection({
  host: 'cljf4js2800mznqd6o8b43qyk',
  user: 'root',
  password: 'password@2022',
  database: 'monitor'
}); */

const connection = mysql.createConnection({
  host: '181.188.156.195',
  port: '18001',
  user: 'clnymjgu10hh3cgpm7yie35j8',
  password: 'xw8LqMzkm7ZCE0QFOOk80WqJ',
  database: 'monitor'
});


module.exports = connection;
