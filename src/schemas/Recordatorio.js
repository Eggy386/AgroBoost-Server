import mongoose from 'mongoose';
const { Schema } = mongoose;

const Recordatorio = new Schema({
    nombre_recordatorio: { type: String, required: true },
    hora_recordatorio: { type: Date, required: true},
    dias_recordatorio: [{ type: String, required: true}],
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activo: { type: Boolean, require: true }
}, { collection: "Recordatorio" })

export default mongoose.model("Recordatorio", Recordatorio)