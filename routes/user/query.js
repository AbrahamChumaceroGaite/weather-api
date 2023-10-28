function getUsers() {
    return "SELECT u.*, r.rol as 'rol' FROM users u JOIN rol r ON u.idrol = r.id WHERE u.deleted = 0";
}

function getUserById(id) {
    return `SELECT * FROM users WHERE id = ${id}`;
}

function postUser(name, email, idrol, pass) {
    return {
        query: "INSERT INTO users (name, email, idrol, pass) VALUES (?, ?, ?, ?)",
        values: [name, email, idrol, pass],
    };
}

function updateUser(id, name, email, idrol, pass) {
    let query = "UPDATE users SET";
    values: [];

    if (name) {
        query += " name = ?,";
        values.push(name);
    }
    if (email) {
        query += " email = ?,";
        values.push(email);
    }
    if (idrol) {
        query += " idrol = ?,";
        values.push(idrol);
    }
    if (pass) {
        query += " pass = ?,";
        values.push(pass);
    }

    // Remove the trailing comma and add the WHERE condition
    query = query.slice(0, -1);
    query += " WHERE id = ?";
    values.push(id);

    return {
        query,
        values,
    };
}

function deleteUser(id) {
    return {
        query: "UPDATE users SET deleted = 1 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicateUser(username, id) {
    return {
        query: "SELECT * FROM users WHERE username = ? AND id <> ?",
        values: [username, id]
    };
}

module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser,
    checkDuplicateUser,
};