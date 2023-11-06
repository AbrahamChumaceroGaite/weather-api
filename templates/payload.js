function welcomePayload(name) {
    return {
        "notification": {
            "title": `Bienvenido ${name}`,
            "body": `De ahora en adelante recibira novedades de sus Estaciones Asignadas.`,
            "icon": "",
            "importance": "high",
            "vibrate": [100, 50, 100],
            "timestamp": Date.now() + 30 * 60 * 1000,
        }
    }
}

function welcomePayloadUser(content) {
    return {
        "notification": {
            "title": `¡Enhorabuena!`,
            "body": content,
            "icon": "",
            "importance": "high",
            "vibrate": [100, 50, 100],
            "timestamp": Date.now() + 30 * 60 * 1000,
        }
    }
}

function newDeviceUser(autor, name, content)
{
    return {
        "notification": {
            "title": `${autor} ha creado una nueva estación`,
            "body": content + ' ' + name,
            "icon": "",
            "importance": "high",
            "vibrate": [100, 50, 100],
            "timestamp": Date.now() + 30 * 60 * 1000,
        }
    }
}
module.exports = {
    welcomePayload, 
    welcomePayloadUser,
    newDeviceUser
}


