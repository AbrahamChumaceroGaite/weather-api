const express = require('express');
const router = express();
const { susbcribeUser, checkIfExistsUser, getSubscriptionUser, getNotificationCode, getNotificacionsUser, getCountNotificacionsUser, getReport, getCountReports, readNotificationUser, MainDashboardUser } = require('./query-user');
const { susbcribeClient, checkIfExistsClient, getNotificacionsClient, getCountNotificacionsClient, readNotificationClient } = require('./query-client');
const { queryDatabase } = require('../../services/db/query')
const verifyToken = require('../../middleware/middleware');
const { pushnotification } = require('../../services/web_push/push-notification');

module.exports = (io) => {
  router.post('/testing', async (req, res) => {
    const notificationData = req.body;
    const dada = "Toma mierda";

    io.emit('notification', notificationData);
    res.json({ mensaje: "A partir de ahora recibirá notificaciones de sus eventos y grupos." });
  });

  router.post('/register/subscription/user', verifyToken, async (req, res) => {
    const id = req.body.id;
    const endpoint = req.body.body.endpoint;
    const p256dh = req.body.body.keys.p256dh;
    const auth = req.body.body.keys.auth;
    try {

      const { queryCheck, valuesCheck } = await checkIfExistsUser(id, endpoint, p256dh, auth);
      const exists = await queryDatabase(queryCheck, valuesCheck)

      if (exists) {
        res.json({ mensaje: "La suscripción ya existe." });
      } else {
        const { querySubs, valuesSubs } = await susbcribeUser(id, endpoint, p256dh, auth);
        const result = await queryDatabase(querySubs, valuesSubs);
        const id = result.insertId;

        if (result.affectedRows === 1) {

          const { queryGetSubs, valuesGetSubs } = await getSubscriptionUser(id);
          const resultsGetUser = await queryDatabase(queryGetSubs, valuesGetSubs);
          const code = 2033;
          const { queryGetMsg, valuesGetMsg } = await getNotificationCode(code);
          const resultsGetMsg = await queryDatabase(queryGetMsg, valuesGetMsg);
          const payload = resultsGetMsg[0].message;

          await pushnotification(resultsGetUser[0], payload);

          res.status(201).send({ message: msj.successPost });
        } else {
          res.status(500).send({ message: msj.errorQuery });
        }
      }
    } catch (err) { console.log(err) }
  });

  router.get('/get/report', verifyToken, async (req, res) => {
    const { id, first, rows } = req.query;
    const startIndex = parseInt(first);
    const numRows = parseInt(rows);
    const { querReports, valuesReports } = await getReport(id, startIndex, numRows);
    try {
      const results = await queryDatabase(querReports, valuesReports).catch(err => console.log(err));
      res.json(results);
    } catch (err) { console.log(err) }

  });

  router.get('/get/notifitacions', verifyToken, async (req, res) => {
    const { id, first, rows } = req.query;
    const startIndex = parseInt(first);
    const numRows = parseInt(rows);
    const { queryNotifications, valuesNotificacions } = await getNotificacions(id, startIndex, numRows);
    const { queryCountNotifications, valuesCountNotificacions } = await getCountNotificacions(id);
    try {
      const results = await queryDatabase(queryNotifications, valuesNotificacions)
      const resultsCount = await queryDatabase(queryCountNotifications, valuesCountNotificacions)
      const countResult = resultsCount[0].totalItems;
      res.json({ items: results, total: countResult });
    } catch (err) { console.log(err) }


  });

  router.put('/update/notificactions/:id', verifyToken, async (req, res) => {
    const id = req.params.id
    try {
      const { queryNotifications, valuesNotificacions } = readNotification(id);
      const results = await queryDatabase(queryNotifications, valuesNotificacions).catch(err => console.log(err));
      res.json(results);
    } catch (err) { console.log(err) }
  });

  return router;
};

