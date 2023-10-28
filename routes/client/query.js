function getClients() {
    return sql = `
      SELECT c.*, r.rol as "rol", lo.name as "location"
      FROM client c
      JOIN rol r on c.idrol = r.id
      JOIN location lo on c.idlocation = lo.id
      WHERE c.deleted = 0
    `;
}

function getClientById(id) {
    return {
        query: `SELECT * FROM client WHERE id = ?`,
        value: [id]
    }
}

function postClient(name, hashedPassword, ci, idrol, idlocation, number) {
    return {
        query: "INSERT INTO client (name, pass, ci, idrol, idlocation, number) VALUES (?, ?, ?, ?, ?, ?)",
        values: [name, hashedPassword, ci, idrol, idlocation, number]
    }
}

function checkExistingClient(ci) {
    return {
        query: "SELECT * FROM client WHERE ci = ?",
        values: [ci]
    }
}

function checkExistingClientUpdate(ci, currentClientId) {
    return {
        query: "SELECT * FROM client WHERE ci = ? AND id <> ?",
        values: [ci, currentClientId]
    }
}

function updateClient(id, name, hashedPassword, ci, idlocation, number) {
    const value = [id];
    let query = "UPDATE client SET ";

    if (name) {
        query += `name=?, `;
        value.push(name);
    }
    if (hashedPassword) {
        query += `pass=?, `;
        value.push(hashedPassword);
    }
    if (ci) {
        query += `ci=?, `;
        value.push(ci);
    }
    if (idlocation) {
        query += `idlocation=?, `;
        value.push(idlocation);
    }
    if (number) {
        query += `number=?, `;
        value.push(number);
    }

    // Elimina la coma final y agrega la condición WHERE
    query = query.slice(0, -2);
    query += ` WHERE id = ?`;

    return { query, value };
}

function deleteClient(id) {
    return {
        query: "UPDATE client SET deleted = 1 WHERE id = ?",
        value: [id]
    }
}

module.exports = {
    getClients,
    getClientById,
    postClient,
    checkExistingClient,
    checkExistingClientUpdate,
    updateClient,
    deleteClient
}