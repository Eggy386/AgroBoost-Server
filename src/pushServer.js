const webpush = require('web-push');
const keys = require('./Keys.json');

// Configurar las claves VAPID
webpush.setVapidDetails(
  'mailto:luis.gomez.21s@utzmg.edu.mx',
  keys.publicKey,
  keys.privateKey
);

// Función para enviar notificaciones push
function sendPush(pushSubscription, message) {
  const payload = JSON.stringify({
    title: 'Contraseña Guardada',
    body: message,
  });

  return webpush.sendNotification(pushSubscription, payload);
}

module.exports = { sendPush };
