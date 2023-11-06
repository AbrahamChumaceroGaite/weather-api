const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOSTCOOLIFYP,
  port: process.env.DB_PORTCOOLIFY,
  user: process.env.DB_USERCOOLIFY,
  password: process.env.DB_PASSWORDCOOLIFY,
  database: process.env.DB_DATABASECOOLIFY
});

const connectionPromise = mysqlPromise.createConnection({
  host: process.env.DB_HOSTCOOLIFYP,
  port: process.env.DB_PORTCOOLIFY,
  user: process.env.DB_USERCOOLIFY,
  password: process.env.DB_PASSWORDCOOLIFY,
  database: process.env.DB_DATABASECOOLIFY
});

module.exports = { connection, connectionPromise };
