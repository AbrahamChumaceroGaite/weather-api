const moment = require('moment-timezone');

function getDataLast(id) {
  const query = `SELECT l.name as "location", d.name, d.status, de.*, DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') AS createdAt 
    FROM device_data de 
    JOIN device d ON de.iddevice = d.id
    JOIN location l ON de.idlocation = l.id
    WHERE de.iddevice = ?
    ORDER BY createdAt DESC
        LIMIT 1`;

  return {
    query,
    values: [id]
  };
}

function getData(id, startDate, endDate) {
  let query = `SELECT d.name, d.status, de.id, de.altitude, de.batt_level, de.hum, de.pres, de.rain, de.temp, de.uv, de.windf, de.winds, DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') as createdAt
    FROM device_data de JOIN device d ON de.iddevice = d.id WHERE de.iddevice = ? `;

  const values = [id];

  if ((!startDate || !endDate)) {
    // Si startDate o endDate están vacíos y no hay filtro global, obtén los datos del último mes
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    startDate = lastWeekDate.toISOString(); // O el formato que necesites
    endDate = new Date().toISOString();
    query += ` AND DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?`;
    values.push(startDate, endDate);
  } else if (startDate && endDate) {
    query += ` AND DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?`;
    values.push(startDate, endDate);
  }

  return {
    query,
    values
  };
}

function getDataByDevice(id) {
  return {
    queryDevice: `SELECT d.name, d.status, de.id, de.altitude, de.batt_level, de.hum, de.pres, de.rain, de.temp, de.uv, de.windf, de.winds, DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') as createdAt
        FROM device_data de JOIN device d ON de.iddevice = d.id WHERE de.iddevice = ? `,
    valuesDevice: [id]
  };
}

function getTotalDataTable(startDate, endDate, globalFilter) {
  let queryR = `SELECT COUNT(*) as totalRecords FROM device_data de `;
  const valuesR = [];
  if ((!startDate || !endDate) && (!globalFilter || globalFilter.trim() === '')) {
    // Si startDate o endDate están vacíos y no hay filtro global, obtén los datos del último mes
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    startDate = lastWeekDate.toISOString(); // O el formato que necesites
    endDate = new Date().toISOString();
    queryR += ` WHERE DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?`;
    valuesR.push(startDate, endDate);
  } else if (startDate && endDate) {
    queryR += ` WHERE DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?`;
    valuesR.push(startDate, endDate);
  }

  return {
    queryR,
    valuesR
  }
}

function getDataTable(startIndex, numRows, globalFilter, sortField, sortOrder, startDate, endDate) {
  let query = `SELECT d.name, d.status, de.*, DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') AS createdAt 
      FROM device_data de
      JOIN device d ON de.iddevice = d.id `;
  const values = [];

  if (globalFilter) {
    query += ` AND (d.name LIKE '%${globalFilter}%')`;
  }

  if ((!startDate || !endDate) && (!globalFilter || globalFilter.trim() === '')) {
    // Si startDate o endDate están vacíos y no hay filtro global, obtén los datos del último mes
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    startDate = lastWeekDate.toISOString(); // O el formato que necesites
    endDate = new Date().toISOString();
    query += ` AND DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?`;
    values.push(startDate, endDate);
  } else if (startDate && endDate) {
    query += ` AND DATE_FORMAT(CONVERT_TZ(de.createdAt, '+00:00', '-04:00'), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?`;
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
    querylocation: `SELECT idlocation FROM device WHERE name = ?`,
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

function calculateHours(data) {
  const result = [];

  data.forEach((item) => {
    const { year, monthName } = getYearMonth(item.createdAt);
    const existingEntry = result.find(entry => entry.year === year && entry.month === monthName);

    if (existingEntry) {
      updateEntry(existingEntry, item.temp, item.hum);
    } else {
      result.push(createEntry(year, monthName, item.temp, item.hum));
    }
  });

  calculateAverages(result);

  return result;
}

function createEntry(year, month, temp, hum) {
  return {
    year,
    month,
    horaFrio: temp < 7 ? 1 : 0,
    horaCalor: temp > 25 ? 1 : 0,
    totalTemp: temp,
    totalHum: hum,
    count: 1, // Inicializamos el contador en 1
  };
}

function updateEntry(entry, temp, hum) {
  entry.horaFrio += temp < 7 ? 1 : 0;
  entry.horaCalor += temp > 23 ? 1 : 0;
  entry.totalTemp += temp;
  entry.totalHum += hum;
  entry.count++; // Incrementamos el contador
}

function calculateAverages(result) {
  for (let entry of result) {
    entry.avgTemp = entry.count > 0 ? parseFloat((entry.totalTemp / entry.count).toFixed(2)) : 0.00;
    entry.avgHum = entry.count > 0 ? parseFloat((entry.totalHum / entry.count).toFixed(2)) : 0.00;
  }
}


function calculateAverages(result) {
  for (let entry of result) {
    entry.avgTemp = entry.count > 0 ? (entry.totalTemp / entry.count).toFixed(2) : '0.00';
    entry.avgHum = entry.count > 0 ? (entry.totalHum / entry.count).toFixed(2) : '0.00';
  }
}


function getYearMonth(createdAt) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const monthName = getSpanishMonthNames()[date.getMonth()];
  return { year, monthName };
}

function getSpanishMonthNames() {
  return [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
}

module.exports = {
  getData,
  getDataLast,
  getDataByDevice,
  getDeviceIdLocation,
  getDataTable,
  getTotalDataTable,
  insertDeviceData,
  deleteDevice,
  calculateHours
}
