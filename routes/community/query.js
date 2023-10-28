function getCommunities() {
    return `
      SELECT c.id, d.name as "department", p.name as "province", m.name as "municipality", c.name, c.createdAt
      FROM community c
      JOIN municipality m ON c.idmunicipality = m.id
      JOIN province p ON m.idprovince = p.id
      JOIN department d ON p.iddepartment = d.id
      WHERE c.deleted = 0
    `;
}

function getCommunityById(id) {
    return {
        query: "SELECT * FROM community WHERE id = ?",
        value: [id],
    };
}

function postCommunity(name, idmunicipality) {
    return {
        query: "INSERT INTO community (idmunicipality, name, deleted) VALUES (?, ?, 0)",
        value: [idmunicipality, name],
    };
}

function checkExistingCommunity(name, idmunicipality) {
    return {
        query: "SELECT * FROM community WHERE name = ? AND idmunicipality = ? AND deleted = 0",
        value: [name, idmunicipality],
    };
}

function checkExistingCommunityUpdate(name, idmunicipality) {
    return {
        query: "SELECT * FROM client WHERE name = ? AND idmunicipality <> ?",
        values: [name, idmunicipality]
    }
}

function updateCommunity(id, name, idmunicipality) {
    let query = "UPDATE community SET";
    const value = [];

    if (name) {
        query += ` name=?,`;
        value.push(name);
    }
    if (idmunicipality) {
        query += ` idmunicipality=?,`;
        value.push(idmunicipality);
    }

    // Elimina la coma final y agrega la condición WHERE
    query = query.slice(0, -1);
    query += ` WHERE id = ?`;
    value.push(id);

    return {
        query,
        value,
    };
}

function deleteCommunity(id) {
    return {
        query: "UPDATE community SET deleted = 1 WHERE id = ?",
        value: [id],
    };
}

module.exports = {
    getCommunities,
    getCommunityById,
    postCommunity,
    checkExistingCommunity,
    checkExistingCommunityUpdate,
    updateCommunity,
    deleteCommunity
};
