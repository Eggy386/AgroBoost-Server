const mongoose = require('mongoose');
const { Schema } = mongoose

const Riego = new Schema({
    hora_riego: { type: Date, required: true },
    dias_riego: [{ type: String, required: true}],
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activo: { type: Boolean, require: true }
}, { collection: "Riego" })

module.exports = mongoose.model("Riego", Riego)