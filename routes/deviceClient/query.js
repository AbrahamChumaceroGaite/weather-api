function getDeviceClients() {
    return `
    SELECT c.id, p.name AS "client", dc.createdAt, dc.createdUpd
    FROM device_client dc
    JOIN client c ON dc.idclient = c.id
    JOIN person p ON c.idperson = p.id`;
}

function getDeviceClientById(id) {
    return {
        query: `SELECT dc.id, c.id AS "idclient", p.name AS "client", dc.createdAt, dc.createdUpd
        FROM device_client dc
        JOIN device d ON dc.idevice = d.id
        JOIN client c ON dc.idclient = c.id
        JOIN person p ON c.idperson = p.id
        WHERE d.id = ? AND dc.deleted = 0`,
        values: [id],
    };
}

function checkDuplicateDeviceClient(idclient, idevice) {
    return {
        query: `SELECT * FROM device_client WHERE idclient = ? AND idevice = ? AND deleted = 0`,
        values: [idclient, idevice],
    };
}

function insertDeviceClient(idclient, idevice) {
    return {
        query: `
        INSERT INTO device_client (idclient, idevice)
        VALUES (?, ?)
      `,
        values: [idclient, idevice],
    };
}

function updateDeviceClient(id, idclient, idevice) {
    let query = "UPDATE device_client SET";
    const values = [];

    if (idclient !== undefined) {
        query += ` idclient = ?,`;
        values.push(idclient);
    }

    if (idevice !== undefined) {
        query += ` idevice = ? `;
        values.push(idevice);
    }

    // Elimina la coma final y agrega la condición WHERE
    query = query.slice(0, -1);
    query += ` WHERE id = ?`;
    values.push(id);

    return {
        query,
        values,
    };
}

function deleteDeviceClient(id) {
    return {
        query: `UPDATE device_client SET deleted = 1 WHERE id = ?`,
        values: [id],
    };
}

module.exports = {
    getDeviceClients,
    getDeviceClientById,
    checkDuplicateDeviceClient,
    insertDeviceClient,
    updateDeviceClient,
    deleteDeviceClient
};
