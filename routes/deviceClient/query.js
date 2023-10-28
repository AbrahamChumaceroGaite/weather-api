function getActiveDeviceClients() {
    return `
      SELECT dc.id, c.name AS "client", d.id AS "idevice", d.name AS "device", dc.createdAt
      FROM device_client dc
      JOIN client c ON dc.idclient = c.id
      JOIN device_id d ON dc.idevice = d.id
      WHERE dc.deleted = 0 AND d.status = 1 AND d.deleted = 0
    `;
}

function getDeviceClientById(id) {
    return `
      SELECT *
      FROM device_client
      WHERE id = ?
    `;
}

function checkDuplicateDeviceClient(idclient, idevice) {
    return {
        query: `
        SELECT idclient, idevice
        FROM device_client
        WHERE idclient = ? AND idevice = ?
      `,
        values: [idclient, idevice],
    };
}

function insertDeviceClient(idclient, idevice) {
    return {
        query: `
        INSERT INTO device_client (idclient, idevice, deleted)
        VALUES (?, ?, 0)
      `,
        values: [idclient, idevice],
    };
}

function updateDeviceClient(id, idclient, idevice) {
    let query = "UPDATE device_client SET";
    const values = [];

    if (idclient !== undefined) {
        query += ` idclient=?,`;
        values.push(idclient);
    }

    if (idevice !== undefined) {
        query += ` idevice=?,`;
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
        query: `
        UPDATE device_client
        SET deleted = 1
        WHERE id = ?
      `,
        values: [id],
    };
}

module.exports = {
    getActiveDeviceClients,
    getDeviceClientById,
    checkDuplicateDeviceClient,
    insertDeviceClient,
    updateDeviceClient,
    deleteDeviceClient
};
