import mongoose from "mongoose";
const { Schema } = mongoose

const Cultivo = new Schema({
    tipo_cultivo: { type: String, required: true },
    tipo_riego: { type: String, required: true },
    programa_riego: { type: String, required: true },
    metodo_fertilizacion: { type: String, required: true },
    fechas_fertilización: { type: Date, required: true },
    cantidad_fertilizante: { type: Number, required: true },
    control_plagas: { type: String, required: true },
    técnica_polinización: { type: String, required: true },
    medidas_siembra: { type: Number, required: true },
    fecha_prevista: { type: Date, required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: "Cultivo" })

export default mongoose.model("Cultivo", Cultivo)