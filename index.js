const app = require("./app"); // Importa la aplicación Express configurada en app.js
const http = require("http").Server(app);

const port = 80; // Puerto obtenido de las variables de entorno

http.listen(port, function () {
  console.log('\n');
  console.log(`>> Express y Socket.io listos y escuchando por el puerto ` + port);
});
