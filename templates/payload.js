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


module.exports = {
    welcomePayload, 
}


