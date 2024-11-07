const mongoose = require('mongoose');
const { Schema } = mongoose

const Producto = new Schema({
    nombre_producto: { type: String, require: true },
    precio: { type: Number, require: true },
    stock: { type: Number, require: true },
    vendidos: { type: Number, require: true },
}, { collection: "Producto"})

module.exports = mongoose.model("Producto", Producto)