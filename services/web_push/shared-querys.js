function GetUserNameAutor (idautor) {
    return {
        queryAutor: `SELECT ur.id, p.name FROM user_rol ur
        JOIN user u ON ur.idautor = u.id
        JOIN person p ON u.idperson = p.id
        WHERE ur.id = ? AND ur.deleted = 0`,
        valuesAutor: [idautor]
    }
}

function GetUsersAdmin () {
    return `SELECT DISTINCT * FROM user_rol WHERE idrol = 1`
}

function GetSuscribersUserAdmin(){
    return `SELECT iduserRol, endpoint, p256dh, auth FROM subscribers_users WHERE iduserRol = 1 AND deleted = 0`
}

function GetMessageFromCode(code){
    return {
        queryCode: `SELECT id, message FROM code_messages WHERE code = ?`,
        valueCode: [code]
    }
}

function InsertUserReport(iduser, idmessage, payload){
    return {
        querInsert: `INSERT INTO user_report (iduserRol, idcode_message, message) VALUES (?, ?, ?)`,
        valuesInsert: [iduser, idmessage, payload]
    }
}

module.exports = {
    GetUserNameAutor,
    GetMessageFromCode,
    GetUsersAdmin,
    GetSuscribersUserAdmin,
    InsertUserReport
}