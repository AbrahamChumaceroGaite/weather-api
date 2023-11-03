const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); 
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require('./middleware/middleware');
const routes = require('./utils/routes');

// Parsear el contenido enviado
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas a usar de prueba
app.get("/weather/api/test", (req, res) => {
  res.send("El Servidor esta bien prendido");
});

app.use('/weather/api/device', routes.device);
app.use('/weather/api/login', routes.login);

app.use('/weather/api/department', verifyToken, routes.department);
app.use('/weather/api/province', verifyToken,routes.province);
app.use('/weather/api/municipality', verifyToken,routes.municipality);
app.use('/weather/api/community', verifyToken,routes.community);
app.use('/weather/api/location', verifyToken,routes.locations);
app.use('/weather/api/device/client', verifyToken,routes.deviceclient);
app.use('/weather/api/client', verifyToken,routes.client);
app.use('/weather/api/person', verifyToken,routes.person);
app.use('/weather/api/rol', verifyToken,routes.rol);
app.use('/weather/api/user', verifyToken,routes.user);


// Endpoint de prueba para WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Escuchar un evento personalizado desde el cliente
  socket.on("mensaje", (data) => {
    console.log("Mensaje del cliente:", data);

    // Enviar un mensaje de vuelta al cliente
    socket.emit("respuesta", "¡Mensaje recibido!");
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

module.exports = app;

