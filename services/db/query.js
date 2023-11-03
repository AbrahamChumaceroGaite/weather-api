const { connection, connectionPromise} = require("./db");

// Función genérica para consultar la base de datos y devolver una promesa
function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  }); 
}

function queryDatabasePromise(connection, query, values) {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await connection.execute(query, values);
      resolve(rows);
    } catch (error) {
      console.log(error)
      reject(error);
    }
  });
}



module.exports = {
  queryDatabase,
  queryDatabasePromise
};
