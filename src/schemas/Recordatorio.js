const mongoose = require('mongoose');
const { Schema } = mongoose;

const Recordatorio = new Schema({
    nombre_recordatorio: { type: String, required: true },
    hora_recordatorio: { type: Date, required: true},
    dias_recordatorio: [{ type: String, required: true}],
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activo: { type: Boolean, require: true }
}, { collection: "Recordatorio" })

module.exports = mongoose.model("Recordatorio", Recordatorio)