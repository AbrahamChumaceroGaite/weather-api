function susbcribeClient(id, endpoint, p256dh, auth) {
    const querySubs = 'INSERT INTO susbcribers_clients (idclient, endpoint, p256dh, auth) VALUES (?,?,?,?)'
    const valuesSubs = [id, endpoint, p256dh, auth]
    return { querySubs, valuesSubs }
}


function getSubscriptionClient(id) {
    const queryGetSubs = 'SELECT endpoint, p256dh, auth FROM subscribers_clients WHERE id = ?'
    const valuesGetSubs = [id]
    return { queryGetSubs, valuesGetSubs }
}

function checkIfExistsClient(id, endpoint, p256dh, auth) {
    // Realiza una consulta para verificar si ya existe un registro con los mismos valores
    const queryCheck = 'SELECT * FROM susbcribers_clients WHERE idclient = ? AND endpoint = ? AND p256dh = ? AND auth = ?';
    const valuesCheck = [id, endpoint, p256dh, auth];
    return { queryCheck, valuesCheck }
}

function getNotificacionsClient(id, startIndex, numRows) {
    let query = `SELECT cm.code, cm.message FROM device_report r
    JOIN code_messages cm ON r.idmessage = cm.id
    JOIN device_client dc ON r.idclient = dc.id
    WHERE dc.idclient = ? AND r.read = 0 ORDER BY cm.createdAt DESC `;

    query += ` LIMIT ${startIndex}, ${numRows}`;

    const queryNotifications = query
    const valuesNotificacions = [id]

    return { queryNotifications, valuesNotificacions }
}

function getCountNotificacionsClient(id) {
    const queryCountNotifications = `SELECT COUNT(*) as totalItems SELECT cm.code, cm.message FROM device_report r
    JOIN code_messages cm ON r.idmessage = cm.id
    JOIN device_client dc ON r.idclient = dc.id
    WHERE dc.idclient = ? AND r.read = 0 ORDER BY cm.createdA DESC `
    const valuesCountNotificacions = [id]

    return { queryCountNotifications, valuesCountNotificacions }
}

function readNotificationClient(id) {
    const queryNotifications = `UPDATE device_report SET read = 1 WHERE id = ?`
    const valuesNotificacions = [id]

    return { queryNotifications, valuesNotificacions }
}


module.exports = {
    susbcribeClient,
    getSubscriptionClient,
    checkIfExistsClient,
    getNotificacionsClient,
    getCountNotificacionsClient,
    readNotificationClient
}