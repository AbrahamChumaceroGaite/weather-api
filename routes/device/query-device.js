function getDataLast(id) {
    const query = `SELECT de.name, d.*, DATE_FORMAT(CONVERT_TZ(d.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') AS newCreatedAt
    FROM device_data d
    JOIN device de ON d.iddevice = de.id
    WHERE d.iddevice = ?
    ORDER BY createdAt DESC
        LIMIT 1`;

    return {
        query,
        values: [id]
    };
}

function getData(id, startDate, endDate) {
    let query = `SELECT de.name, d.*, DATE_FORMAT(CONVERT_TZ(d.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') AS newCreatedAt
                 FROM device_data d
                 JOIN device de ON d.iddevice = de.id
                 WHERE d.iddevice = ? `;
  
    const values = [id];
  
    if (startDate && endDate) {
      query += ` AND d.createdAt BETWEEN ? AND ?`;
      values.push(startDate, endDate);
    }
  
    query += ` ORDER BY createdAt DESC`;
  
    return {
      query,
      values
    };
  }
  

function getDeviceIdLocation(id) {
    return {
        querylocation: `SELECT idlocation FROM device WHERE id = ?`,
        valueslocation: [id],
    }
}

function insertDeviceData(idlocation, data) {
    const { iddevice, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number } = data;

    return {
        query: `INSERT INTO device_data (iddevice, idlocation, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,
        values: [iddevice, idlocation, temp, hum, pres, uv, altitude, rain, windf, winds, batt_level, lat, lon, number],
    };
}

function deleteDevice(id) {
    return {
        query: "UPDATE device SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getData,
    getDataLast,
    getDeviceIdLocation,
    insertDeviceData,
    deleteDevice
}