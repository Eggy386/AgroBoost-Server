const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuariosSchema = new Schema({
  nombre: { type: String, required: true },
  apellido_paterno: { type: String, required: true },
  apellido_materno: { type: String, required: true },
  correo_electronico: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: Number, requred: true },
  direccion: {
    calle: String,
    numero_ex: Number,
    numero_int: Number,
    colonia: String,
    estado: String,
    ciudad: String,
    codigo_postal: Number
  },
  imagen_perfil: { type: String }
}, { collection: 'Usuarios' });

module.exports = mongoose.model("Usuarios", UsuariosSchema);
