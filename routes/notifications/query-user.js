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
    const queryGetMsg = 'SELECT id, message FROM code_messages WHERE code = ?'
    const valuesGetMsg = [code]
    return { queryGetMsg, valuesGetMsg }
}

function checkIfExistsUser(id, endpoint, p256dh, auth) {
    // Realiza una consulta para verificar si ya existe un registro con los mismos valores
    const queryCheck = 'SELECT * FROM subscribers_users WHERE iduserRol = ? AND endpoint = ? AND p256dh = ? AND auth = ?';
    const valuesCheck = [id, endpoint, p256dh, auth];
    return { queryCheck, valuesCheck }
}

function insertReport(id, message, payload) {
    const queryInsert = 'INSERT INTO user_report (iduserRol, idcode_message, message) VALUES (?,?,?)'
    const valuesInsert = [id, message, payload]
    return { queryInsert, valuesInsert,  }

}

function getNotificacionsUser(id, startIndex, numRows) {
    let query = `SELECT ur.id, cm.code, ur.message, cm.createdAt FROM user_report ur
    JOIN code_messages cm ON ur.idcode_message = cm.id
    WHERE ur.iduserRol = ? AND ur.deleted = 0 ORDER BY cm.createdAt DESC`;
    const queryNotifications = query
    const valuesNotificacions = [id]

    return { queryNotifications, valuesNotificacions }
}

function getCountNotificacionsUser(id) {
    const queryCountNotifications = `SELECT COUNT(*) as totalItems FROM user_report ur
    JOIN code_messages cm ON ur.idcode_message = cm.id
    WHERE ur.iduserRol = ? AND ur.deleted = 0`
    const valuesCountNotificacions = [id]

    return { queryCountNotifications, valuesCountNotificacions }
}

function isAdmin(id) {
    return {
        queryAdmin: `SELECT idrol FROM user_rol WHERE id = ?`,
        valuesAdmin: [id]
    }
}

function getReport(id) {
    let queryReport = `SELECT ur.id, cm.code, ur.message, cm.createdAt FROM user_report ur
    JOIN code_messages cm ON ur.idcode_message = cm.id
    JOIN user_rol us ON ur.iduserRol = us.id
    JOIN rol r ON us.id = r.idautor
    WHERE r.id = ? ORDER BY cm.createdAt DESC`

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
    const queryNotifications = `UPDATE user_report SET deleted = 1, readDate = NOW() WHERE id = ?`
    const valuesNotificacions = [id]

    return { queryNotifications, valuesNotificacions }
}

function MainDashboardUser() {

    const selectClients = `SELECT COUNT(*) as total_clients FROM client WHERE deleted = 0`

    const selectPersons = `SELECT COUNT(*) as total_persons FROM person WHERE deleted = 0`

    const selectDeviceON = `SELECT COUNT(*) as total_devicesON FROM device WHERE status = 1 AND deleted = 0`

    const selectDeviceOFF = `SELECT COUNT(*) as total_deviceOFF FROM device WHERE status = 0 AND deleted = 0`

    const selectUsers = `SELECT COUNT(*) as total_users FROM user_rol WHERE deleted = 0`

    const selectLocations = `SELECT DISTINCT lat, lon FROM device_data`

    return { selectClients, selectPersons, selectDeviceON, selectDeviceOFF, selectUsers, selectLocations }

}

module.exports = {
    isAdmin,
    getSubscriptionUser,
    getNotificationCode,
    susbcribeUser,
    checkIfExistsUser,
    insertReport,
    getNotificacionsUser,
    getCountNotificacionsUser,
    getReport,
    getCountReports,
    readNotificationUser,
    MainDashboardUser
}