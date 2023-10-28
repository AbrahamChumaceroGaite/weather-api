const express = require('express');
const router = express();
const { registersubs, getReport, getNotificacions, getCountNotificacions, readNotification, MainDashboard, checkIfExists } = require('./query');
const { queryDatabase } = require('../shared/querys')
const verifyToken = require('../../middleware/middleware');


router.post('/register/subscription', verifyToken, async (req, res) => {
  const id = req.body.id;
  const endpoint = req.body.body.endpoint;
  const p256dh = req.body.body.keys.p256dh;
  const auth = req.body.body.keys.auth;
  try {

    const {queryCheck, valuesCheck} = await checkIfExists(id, endpoint, p256dh, auth);
    const exists = await queryDatabase(queryCheck, valuesCheck)

    if (exists) {
      res.json({ mensaje: "La suscripción ya existe." });
    } else {
      const { querySubs, valuesSubs } = registersubs(id, endpoint, p256dh, auth);

      await queryDatabase(querySubs, valuesSubs);
      res.json({ mensaje: "A partir de ahora recibirá notificaciones de sus eventos y grupos." });
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


module.exports = router;
