const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require('./middleware/middleware');
const routes = require('./utils/routes');
const notificationRouter = require('./routes/notifications/notifications')(io);
const deviceClientRouter = require('./routes/deviceClient/deviceclient')(io);
const deviceRouter = require('./routes/device/device')(io);

// Parsear el contenido enviado
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas a usar de prueba
app.get("/weather/api/test", (req, res) => {
  res.send("El Servidor esta prendido");
});

app.use('/weather/api/device', deviceRouter);
app.use('/weather/api/login', routes.login);


app.use('/weather/api/category', verifyToken, routes.category);
app.use('/weather/api/department', verifyToken, routes.department);
app.use('/weather/api/province', verifyToken, routes.province);
app.use('/weather/api/municipality', verifyToken, routes.municipality);
app.use('/weather/api/notification', notificationRouter);
app.use('/weather/api/community', verifyToken, routes.community);
app.use('/weather/api/location', verifyToken, routes.locations);
app.use('/weather/api/device/client', verifyToken, deviceClientRouter);
app.use('/weather/api/client', verifyToken, routes.client);
app.use('/weather/api/person', verifyToken, routes.person);
app.use('/weather/api/product', verifyToken, routes.product);
app.use('/weather/api/rol', verifyToken, routes.rol);
app.use('/weather/api/user', verifyToken, routes.user);


io.on("connection", (socket) => {
  const idHandShake = socket.id;
  const { nameRoom } = socket.handshake.query;

  socket.join(nameRoom);

  socket.on('notification', (res) => {
    const data = res;
    console.log(data);
    socket.to(nameRoom).emit('notification', '');
  })

  socket.on('devicedata', (res) => {
    const data = res;
    console.log(data);
    socket.to(nameRoom).emit('devicedata', '');
  })

  // Manejo de errores
  socket.on('error', (error) => {
    console.error("Error en la conexión: " + error);
  });
});


// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

function emitNotification(room, message) {
  io.to(room).emit('notification', message);
}

const port = 80; // Puerto obtenido de las variables de entorno

http.listen(port, function () {
  console.log('\n');
  console.log(`>> Express y Socket.io listos y escuchando por el puerto ` + port);
});

module.exports = app;
module.exports.io = io;
