const moment = require('moment-timezone');

function getDevices() {
    return "SELECT * FROM device WHERE device_id IS NOT NULL";
}

function getDeviceList() {
    return `
      SELECT c.name AS "client", de.*
      FROM device de
      LEFT JOIN device_id d ON d.name = de.device_id
      LEFT JOIN device_client dc ON dc.idevice = d.id
      LEFT JOIN client c ON dc.idclient = c.id
    `;
}

function getDeviceListById(id, startDate, endDate) {
    let sql = `
      SELECT c.name AS client, d.id AS deviceid, de.*
      FROM device de
      LEFT JOIN device_id d ON d.name = de.device_id
      LEFT JOIN device_client dc ON dc.idevice = d.id
      LEFT JOIN client c ON dc.idclient = c.id
      WHERE d.id = ?
    `;

    if (startDate && endDate) {
        const start = moment(startDate).utcOffset(-4, true);
        const end = moment(endDate).utcOffset(-4, true);

        if (start.isValid() && end.isValid()) {
            sql += `
          AND de.createdAt >= ?
          AND de.createdAt <= ?
        `;
            return {
                query: sql,
                value: [id, start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss')],
            };
        }
    }

    return {
        query: sql,
        value: [id],
    };
}

function insertDeviceData(data) {
    const { device_id, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number } = data;

    const date = new Date();
    const fecha = moment.utc(date).tz('America/La_Paz').format('YYYY-MM-DD HH:mm:ss');

    return {
        query: `
        INSERT INTO device (device_id, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        values: [device_id, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number, fecha],
    };
}

function deleteDevice(id) {
    return {
        query: "UPDATE device SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getDevices,
    getDeviceList,
    getDeviceListById,
    insertDeviceData,
    deleteDevice
};