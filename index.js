const app = require("./app"); // Importa la aplicación Express configurada en app.js
const http = require("http");

const port = 80; // Puerto obtenido de las variables de entorno

const server = http.createServer(app); // Crea un servidor HTTP a partir de la aplicación Express

server.listen(port, () => {
  console.log(`El maldito servidor está escuchando en el puerto ${port}`);
});
