import mongoose from "mongoose";
const { Schema } = mongoose

const Notificaciones = new Schema({
    titulo: { type: String, required: true },
    mensaje: { type: String, required: true},
    programar_notificacion: { type: Date, required: true }
}, { collection: "Notificaciones" })

export default mongoose.model("Notificaciones", Notificaciones)