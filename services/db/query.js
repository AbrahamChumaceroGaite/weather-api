const db = require("./db");

// Función genérica para consultar la base de datos y devolver una promesa
function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


module.exports = {
  queryDatabase,
};
