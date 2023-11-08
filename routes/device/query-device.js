const moment = require('moment-timezone');

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

function getTotalDataTable(startDate, endDate, globalFilter) {
    let queryR = `SELECT COUNT(*) as totalRecords FROM device_data de `;
    const valuesR = [];
    if ((!startDate || !endDate) && (!globalFilter || globalFilter.trim() === '')) {
        // Si startDate o endDate están vacíos y no hay filtro global, obtén los datos del último mes
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        startDate = lastMonthDate.toISOString(); // O el formato que necesites
        endDate = new Date().toISOString();
        queryR += ` WHERE CONVERT_TZ(de.createdAt, '+00:00', '-04:00') BETWEEN ? AND ?`;
        valuesR.push(startDate, endDate);
    } else if (startDate && endDate) {
        const timeZoneOffset = -4 * 60; // -4 horas en minutos
        startDate = new Date(startDate);
        startDate.setMinutes(startDate.getMinutes() - timeZoneOffset);
        startDate = startDate.toISOString();
        endDate = new Date(endDate);
        endDate.setMinutes(endDate.getMinutes() - timeZoneOffset);
        endDate = endDate.toISOString();
        queryR += ` WHERE CONVERT_TZ(de.createdAt, '+00:00', '-04:00') BETWEEN ? AND ?`;
        valuesR.push(startDate, endDate);
    }

    return {
        queryR,
        valuesR
    }
}

function getDataTable(startIndex, numRows, globalFilter, sortField, sortOrder, startDate, endDate) {
    let query = `SELECT d.name, d.status, de.*, CONVERT_TZ(de.createdAt, '+00:00', '-04:00') AS createdAt 
      FROM device_data de
      JOIN device d ON de.iddevice = d.id `;
    const values = [];

    if (globalFilter) {
        query += ` AND (d.name LIKE '%${globalFilter}%')`;
    }

    if ((!startDate || !endDate) && (!globalFilter || globalFilter.trim() === '')) {
        // Si startDate o endDate están vacíos y no hay filtro global, obtén los datos del último mes
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        startDate = lastMonthDate.toISOString(); // O el formato que necesites
        endDate = new Date().toISOString();
        query += ` AND CONVERT_TZ(de.createdAt, '+00:00', '-04:00') BETWEEN ? AND ?`;
        values.push(startDate, endDate);
    } else if (startDate && endDate) {
        query += ` AND CONVERT_TZ(de.createdAt, '+00:00', '-04:00') BETWEEN ? AND ?`;
        values.push(startDate, endDate);
    }

    if (!sortField || !sortOrder) {
        // Ordenar por defecto por createdAt en orden descendente
        query += ` ORDER BY createdAt DESC`;
    } else {
        // Ordenar según las preferencias del usuario
        query += ` ORDER BY ${sortField} ${sortOrder === '-1' ? 'ASC' : 'DESC'}`;
    }

    query += ` LIMIT ${startIndex}, ${numRows}`;

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
    getDataTable,
    getTotalDataTable,
    insertDeviceData,
    deleteDevice
}