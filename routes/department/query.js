function getDepartments() {
    return "SELECT * FROM department WHERE deleted = 0";
}

function getDepartmentById(id) {
    return {
        query: "SELECT * FROM department WHERE id = ?",
        value: [id],
    };
}

function postDepartment(name) {
    return {
        query: "INSERT INTO department (name, deleted) VALUES (?, 0)",
        value: [name],
    };
}

function checkExistingDepartment(name) {
    return {
        query: "SELECT * FROM department WHERE name = ? AND deleted = 0",
        value: [name],
    };
}

function updateDepartment(id, name) {
    let query = "UPDATE department SET";
    const value = [];

    if (name) {
        query += ` name=?,`;
        value.push(name);
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

function checkExistingDepartmentUpdate(name, idmunicipality) {
    return {
        query: "SELECT * FROM client WHERE name = ? AND id <> ?",
        values: [name, idmunicipality]
    }
}

function deleteDepartment(id) {
    return {
      query: "UPDATE department SET deleted = 1 WHERE id = ?",
      value: [id],
    };
  }

module.exports = {
    getDepartments,
    getDepartmentById,
    postDepartment,
    checkExistingDepartment,
    checkExistingDepartmentUpdate,
    updateDepartment,
    deleteDepartment
};