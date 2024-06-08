import mongoose from "mongoose";
const { Schema } = mongoose

const Ventas = new Schema({
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    id_producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
    fecha_venta: { type: Date, required: true },
    estado_venta: { type: String, required: true }
}, { collection: 'Ventas'})

export default mongoose.model("Ventas", Ventas)