const mongoose = require('mongoose');
const { Schema } = mongoose

const Notificaciones = new Schema({
    titulo: { type: String, required: true },
    mensaje: { type: String, required: true},
    programar_notificacion: { type: Date, required: true }
}, { collection: "Notificaciones" })

module.exports = mongoose.model("Notificaciones", Notificaciones)