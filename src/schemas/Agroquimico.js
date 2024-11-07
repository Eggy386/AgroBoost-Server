const mongoose = require('mongoose');
const { Schema } = mongoose

const Agroquimico = new Schema({
    tipo_agroquímico: {type: String, required: true },
    nombre_agroquímico: {type: String, required: true },
    programa_aplicación: {type: Date, required: true },
    método_aplicación: {type: String, required: true },
    cantidad_aplicada: {type: Number, required: true },
}, { collection: "Agroquimico" })

module.exports =  mongoose.model("Agroquimico", Agroquimico)