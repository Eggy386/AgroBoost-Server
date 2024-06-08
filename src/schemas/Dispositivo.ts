import mongoose from "mongoose";
const { Schema } = mongoose

const Dispositivo = new Schema({
    nombre_dispositivo: { type: String, required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    id_cultivo: { type: Schema.Types.ObjectId, ref: 'Cultivo' },
    datos: { type: Schema.Types.Mixed, required: true }
}, { collection: "Dispositivo" })

export default mongoose.model("Dispositivo", Dispositivo)