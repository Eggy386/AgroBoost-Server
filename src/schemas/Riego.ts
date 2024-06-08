import mongoose from "mongoose";
const { Schema } = mongoose

const Riego = new Schema({
    Hora_riego: { type: Date, required: true },
    dias_riego: [{ type: String, required: true}]
}, { collection: "Riego" })

export default mongoose.model("Riego", Riego)