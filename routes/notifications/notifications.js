const express = require('express');
const router = express();
const msj = require('../../templates/messages');
const { susbcribeUser, isAdmin, checkIfExistsUser, insertReport, getSubscriptionUser, getNotificationCode, getNotificacionsUser, getCountNotificacionsUser, getReport, readNotificationUser, MainDashboardUser } = require('./query-user');
const { susbcribeClient, checkIfExistsClient, getNotificacionsClient, getCountNotificacionsClient, readNotificationClient } = require('./query-client');
const { queryDatabase } = require('../../services/db/query')
const verifyToken = require('../../middleware/middleware');
const { PushNotification } = require('../../services/web_push/push-notification');
const { welcomePayloadUser } = require('../../templates/payload');


module.exports = (io) => {
  router.post('/testing', async (req, res) => {
    io.to(nameRoom).emit('notification', '');
  });

  router.post('/register/subscription/user', verifyToken, async (req, res) => {
    const id = req.body.id;
    const endpoint = req.body.body.endpoint;
    const p256dh = req.body.body.keys.p256dh;
    const auth = req.body.body.keys.auth;

    try {

      const { queryCheck, valuesCheck } = await checkIfExistsUser(id, endpoint, p256dh, auth);
      const exists = await queryDatabase(queryCheck, valuesCheck)

      if (exists.length > 0) {
        res.json({ mensaje: "La suscripción ya existe." });
      } else {
        const { querySubs, valuesSubs } = await susbcribeUser(id, endpoint, p256dh, auth);
        const result = await queryDatabase(querySubs, valuesSubs);
        const idnewsubscription = result.insertId;

        if (result.affectedRows === 1) {

          const { queryGetSubs, valuesGetSubs } = await getSubscriptionUser(idnewsubscription);
          const resultsGetUser = await queryDatabase(queryGetSubs, valuesGetSubs);
          const code = 2033;
          const { queryGetMsg, valuesGetMsg } = await getNotificationCode(code);
          const resultsGetMsg = await queryDatabase(queryGetMsg, valuesGetMsg);
          const content = resultsGetMsg[0].message;
          const codemsj = 11
          const payload = await welcomePayloadUser(content);
          const insertReportUser = await insertReport(id, codemsj, payload.notification.body);
          const resultInsertReport = await queryDatabase(insertReportUser.queryInsert, insertReportUser.valuesInsert);

          if (resultInsertReport.affectedRows === 1) {
            io.emit('notification', '');
            await PushNotification(resultsGetUser[0], payload);
          }         
          res.status(201).send({ message: msj.successPost });
        } else {
          console.log("Error al insertar la suscripción");
        }
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.get('/get/report/user', verifyToken, async (req, res) => {
    const { id } = req.query;
    const { queryAdmin, valuesAdmin } = await isAdmin(id);
    const admin = await queryDatabase(queryAdmin, valuesAdmin);
    const idAdmin = admin[0].idrol;

    const { querReports, valuesReports } = await getReport(idAdmin);
    try {
      const results = await queryDatabase(querReports, valuesReports).catch(err => console.log(err));
      res.json(results);
    } catch (err) { console.log(err) }

  });

  router.get('/get/notifitacions/user', verifyToken, async (req, res) => {
    const { id } = req.query;
    const { queryNotifications, valuesNotificacions } = await getNotificacionsUser(id);
    const { queryCountNotifications, valuesCountNotificacions } = await getCountNotificacionsUser(id);
    try {
      const results = await queryDatabase(queryNotifications, valuesNotificacions)
      const resultsCount = await queryDatabase(queryCountNotifications, valuesCountNotificacions)
      const countResult = resultsCount[0].totalItems;
      res.json({ items: results, total: countResult });
    } catch (err) { 
      console.log(err) 
    }
  });

  router.put('/update/notificactions/user/:id', verifyToken, async (req, res) => {
    const id = req.params.id
    try {
      const { queryNotifications, valuesNotificacions } = readNotificationUser(id);
      const results = await queryDatabase(queryNotifications, valuesNotificacions).catch(err => console.log(err));
      res.json(results);
    } catch (err) { console.log(err) }
  });

  router.get('/main/admin/dashboard/users', verifyToken, async (req, res) => {

    const { selectClients,selectPersons, selectDeviceON, selectDeviceOFF, selectUsers, selectLocations} = await MainDashboardUser(req.query.id);
  
    try {
      const [
        resultsUsers,
        resultPersons,
        resultsClients,
        resultsDeviceON,
        resultsDeviceOFF,
        resultsLocations
      ] = await Promise.all([
        queryDatabase(selectUsers),
        queryDatabase(selectPersons),
        queryDatabase(selectClients),
        queryDatabase(selectDeviceON),
        queryDatabase(selectDeviceOFF),
        queryDatabase(selectLocations)
      ]).catch(err => console.log(err));
  
      const totalUsers = resultsUsers[0].total_users;
      const totalPersons = resultPersons[0].total_persons;
      const totalDeviceON = resultsDeviceON[0].total_devicesON;
      const totalDeviceOFF = resultsDeviceOFF[0].total_deviceOFF;
      const totalClients = resultsClients[0].total_clients;
      const totalLocations = resultsLocations;  
      res.json({
        totalUsers,
        totalPersons,
        totalDeviceON,
        totalDeviceOFF,
        totalClients,
        totalLocations
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ mensaje: messages.errorquery });
    }
  });

  return router;
};

