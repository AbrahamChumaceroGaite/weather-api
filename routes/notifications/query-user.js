function susbcribeUser(id, endpoint, p256dh, auth) {
    const querySubs = 'INSERT INTO subscribers_users (iduserRol, endpoint, p256dh, auth) VALUES (?,?,?,?)'
    const valuesSubs = [id, endpoint, p256dh, auth]
    return { querySubs, valuesSubs }
}

function getSubscriptionUser(id) {
    const queryGetSubs = 'SELECT endpoint, p256dh, auth FROM subscribers_users WHERE id = ?'
    const valuesGetSubs = [id]
    return { queryGetSubs, valuesGetSubs }
}

function getNotificationCode(code) {
    const queryGetMsg = 'SELECT message FROM code_messages WHERE code = ?'
    const valuesGetMsg = [code]
    return { queryGetMsg, valuesGetMsg }
}

function checkIfExistsUser(id, endpoint, p256dh, auth) {
    // Realiza una consulta para verificar si ya existe un registro con los mismos valores
    const queryCheck = 'SELECT * FROM subscribers_users WHERE iduserRol = ? AND endpoint = ? AND p256dh = ? AND auth = ?';
    const valuesCheck = [id, endpoint, p256dh, auth];
    return { queryCheck, valuesCheck }
}

function getNotificacionsUser(id, startIndex, numRows) {
    let query = `SELECT cm.code, cm.message FROM user_report ur
    JOIN code_messages cm ON ur.idcode_message = cm.id
    WHERE ur.iduserRol = ? AND ur.read = 0 ORDER BY cm.createdAt DESC `;

    query += ` LIMIT ${startIndex}, ${numRows}`;

    const queryNotifications = query
    const valuesNotificacions = [id]

    return { queryNotifications, valuesNotificacions }
}

function getCountNotificacionsUser(id) {
    const queryCountNotifications = `SELECT COUNT(*) as totalItems FROM user_report ur
    JOIN code_messages cm ON ur.idcode_message = cm.id
    WHERE ur.iduserRol = ? AND ur.read = 0 ORDER BY cm.createdA DESC `
    const valuesCountNotificacions = [id]

    return { queryCountNotifications, valuesCountNotificacions }
}

function getReport(id, startIndex, numRows) {
    let queryReport = `SELECT ev.* FROM evento_re ev
    JOIN evento e ON ev.idevento = e.id WHERE e.iduserRol = ? ORDER BY ev.fechaC DESC`

    queryReport += ` LIMIT ${startIndex}, ${numRows}`;

    const querReports = queryReport
    const valuesReports = [id]

    return { querReports, valuesReports }
}

function getCountReports(id) {
    const queryCountNotifications = `SELECT COUNT(*) as totalItems FROM evento_re ev
    JOIN evento e ON ev.idevento = e.id
    JOIN usuario_r ON e.iduserRol = ? WHERE ev.disponible = 1 ORDER BY ev.fechaC DESC`
    const valuesCountNotificacions = [id]

    return { queryCountNotifications, valuesCountNotificacions }
}

function readNotificationUser(id) {
    const queryNotifications = `UPDATE user_report SET read = 1 WHERE id = ?`
    const valuesNotificacions = [id]

    return { queryNotifications, valuesNotificacions }
}

function MainDashboardUser(id) {

    const selectUsers = `SELECT COUNT(*) as totalusuarios FROM usuario_r WHERE iduserRol = ${id};`

    const selectEvents = `SELECT COUNT(*) as totaleventos FROM evento WHERE iduserRol = ${id};`

    const selectGroups = `SELECT COUNT(*) as totalgrupos FROM grupos WHERE iduserRol = ${id};`

    const selectCertified = `SELECT COUNT(*) as totalcertificados FROM certificado c
   JOIN plantilla p ON c.idplantilla = p.id
   JOIN evento e ON p.idevento = e.id
   WHERE e.iduserRol = ${id};`

    const selectSponsors = `SELECT COUNT(*) as totalauspiciadores FROM auspiciadores WHERE iduserRol = ${id};`

    const selectSignatures = `SELECT COUNT(*) as totalfirmantes FROM firmas WHERE iduserRol = ${id};`

    const selectTemplates = `SELECT COUNT(*) as totalplantillas FROM plantilla p JOIN evento e ON p.idevento = e.id WHERE e.iduserRol = ${id};`

    const selectTotalCheck = `SELECT COUNT(*) as totalrevision FROM certificado c JOIN plantilla p ON c.idplantilla = p.id JOIN evento e ON p.idevento = e.id WHERE c.status = 1 AND e.iduserRol = ${id};`

    const selectTotalWait = `SELECT COUNT(*) as totalespera FROM certificado c JOIN plantilla p ON c.idplantilla = p.id JOIN evento e ON p.idevento = e.id WHERE c.status = 2 AND e.iduserRol = ${id};`

    const selectTotalSend = `SELECT COUNT(*) as totalemitidos FROM certificado c JOIN plantilla p ON c.idplantilla = p.id JOIN evento e ON p.idevento = e.id WHERE c.status = 3 AND e.iduserRol = ${id};`

    const selectTotalAnulates = `SELECT COUNT(*) as totalanulados FROM certificado c JOIN plantilla p ON c.idplantilla = p.id JOIN evento e ON p.idevento = e.id WHERE c.status = 4 AND e.iduserRol =  ${id};`

    const values = [id]
    return { selectUsers, selectEvents, selectGroups, selectCertified, selectSponsors, selectSignatures, selectTemplates, selectTotalCheck, selectTotalWait, selectTotalSend, selectTotalAnulates, values }

}

module.exports = {
    getSubscriptionUser,
    getNotificationCode,
    susbcribeUser,
    checkIfExistsUser,
    getNotificacionsUser,
    getCountNotificacionsUser,
    getReport,
    getCountReports,
    readNotificationUser,
    MainDashboardUser
}