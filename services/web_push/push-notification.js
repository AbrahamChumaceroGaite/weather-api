const webpush = require('web-push');
require('dotenv').config();

let VapidKeys = {
    subject: 'mailto:tu@email.com',
    privateKey: process.env.PRIVATEKEY,
    publicKey: process.env.PUBLICKEY
};

async function PushNotification(subscriptionData, payload){
    const subscription = {
        endpoint: subscriptionData.endpoint,
        keys: {
            auth: subscriptionData.auth,
            p256dh: subscriptionData.p256dh
        }
    };
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify(payload),
            {
                vapidDetails: VapidKeys,
                TTL: 30
            }
        );
    } catch (error) {
        console.error('Error al enviar notificación', error);
    }

}

module.exports = {
    PushNotification
}