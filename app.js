const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// Parsear el contenido enviado
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas a usar de prueba
app.get("/weather/api/test", (req, res) => {
  res.send("El Servidor esta bien prendido");
});

// Importamos las rutas
const device = require('./routes/device');
const deviceclient = require('./routes/deviceclient');
const department = require('./routes/department');
const province = require('./routes/province');
const municipality = require('./routes/municipality');
const community = require('./routes/community');
const locations = require('./routes/location');
const client = require('./routes/client');
const rol = require('./routes/rol');
const user = require('./routes/users');
const login = require('./routes/login');

// Declaramos las rutas 
app.use('/weather/api/department', department);
app.use('/weather/api/province', province);
app.use('/weather/api/municipality', municipality);
app.use('/weather/api/community', community);
app.use('/weather/api/location', locations);
app.use('/weather/api/device', device);
app.use('/weather/api/device/client', deviceclient);
app.use('/weather/api/client', client);
app.use('/weather/api/rol', rol);
app.use('/weather/api/user', user);
app.use('/weather/api', login);
// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error del servidor' });
  });

  app.listen(80, () => {
    console.log ("Bien Prendido")
  });

