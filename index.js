// Importar dependencias y Schemas
import express from 'express'
import mongoose from 'mongoose'
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
import bodyParser from 'body-parser'
import cors from 'cors';
import { exec } from 'child_process';
import Usuarios from './src/schemas/Usuarios';
import Cultivo from './src/schemas/Cultivo';
import Dispositivo from './src/schemas/Dispositivo';
import Recordatorio from './src/schemas/Recordatorio';
import Riego from './src/schemas/Riego';
import Ventas from './src/schemas/Ventas';
import Agroquimico from './src/schemas/Agroquimico'
import Notificaciones from './src/schemas/Notificaciones'
import Producto from './src/schemas/Producto'
const bcrypt = require('bcrypt')
require('dotenv').config()
const path = require('path');
const fs = require('fs');

// Configuración inicial
const app = express()
const port = process.env.SERVER_PORT || 3000

// Configuracion de middleware
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());
// Define la ruta completa hacia la carpeta 'uploads'
const uploadsPath = path.join(__dirname, 'uploads');

// Servir la carpeta 'uploads' como estática
app.use('/uploads', express.static(uploadsPath));

// Conexión a la base de datos
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017"

mongoose.connect(mongoURI).then(() => {
  console.log("Connected Success");
}).catch((err) => {
  console.log("Error:", err);
});

// Ruta para autenticar usuarios
app.post('/login', async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  try {
    const usuario = await Usuarios.findOne({ correo_electronico });
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const hash = usuario.contrasena
    const isValid = await bcrypt.compare(contrasena, hash)

    if (isValid) {
      res.json({ success: true, message: 'Inicio de sesión exitoso', usuario});
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Registrar nuevos usuarios
app.post('/register', async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, correo_electronico, contrasena, rol } = req.body;

  try {
    const usuarioExistente = await Usuarios.findOne({ correo_electronico });
    if (usuarioExistente) {
      return res.status(401).json({ mensaje: "Este correo electrónico ya está registrado"});
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(contrasena, saltRounds)

    const datos = new Usuarios({ nombre, apellido_paterno, apellido_materno, correo_electronico, contrasena: hash, rol });
    await datos.save();

    res.status(200).json({ success: true, mensaje: 'Registro guardado'});
  } catch (error) {
    return res.status(500).json({ mensaje: "Error interno del servidor"})
  }
});

// Obtener una lista de los usuarios registrados
app.get('/users', async (req, res) => {
  try {
    const users = await Usuarios.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener a los usuarios' });
  }
});

// Obtener detalles de un usuario en específico
app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Usuarios.findById(userId);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

app.post('/registerCultivo', async (req, res) => {
  console.log(req.body)
  const {
    tipo_cultivo, 
    fecha_siembra,
    tipo_riego, 
    programa_riego, 
    metodo_fertilizacion, 
    fechas_fertilizacion, 
    cantidad_fertilizante, 
    control_plagas, 
    tecnica_polinizacion, 
    medidas_siembra, 
    fecha_prevista, 
    id_usuario
  } = req.body

  try {
    const newCultivo = new Cultivo({
      tipo_cultivo,
      fecha_siembra,
      tipo_riego,
      programa_riego,
      metodo_fertilizacion,
      fechas_fertilizacion,
      cantidad_fertilizante,
      control_plagas,
      tecnica_polinizacion,
      medidas_siembra,
      fecha_prevista,
      id_usuario
    })

    await newCultivo.save()
    res.status(201).json({ success: true, message: 'Cultivo Registrado exitosamente', cultivo: newCultivo })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar el cultivo', error });
  }
})

// Obtener una lista de los cultivos registrados
app.get('/cultivos', async (req, res) => {
  try {
    const cultivosDetalles = await Cultivo.aggregate([
      {
        $lookup: {
          from: 'Usuarios',
          localField: 'id_usuario',
          foreignField: '_id',
          as: 'usuario'
        }
      },
      { $unwind: '$usuario' }
    ]);
    res.json(cultivosDetalles);
  } catch (error) {
    console.error('Error al obtener los detalles de los cultivos:', error);
    res.status(500).json({ message: 'Error al obtener los detalles de los cultivos' });
  }
});

// Obtener una lista de los cultivos de un usuario en específico
app.get('/cultivos/:userId', async (req, res) => {
  const userId = req.params.userId
  try {
    const cultivos = await Cultivo.find({id_usuario: userId})
    res.json(cultivos) 
  } catch (error) {
    console.error('Error al obtener los cultivos:', error);
    res.status(500).json({ error: 'Error al obtener los cultivos' });
  }
})

// Obtener una lista de los dispositivos de un usuario en específico
app.get('/dispositivo/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const dispositivos = await Dispositivo.find({ id_usuario: userId }).populate('id_cultivo');
    res.json(dispositivos);
  } catch (error) {
    console.error('Error al obtener los dispositivos:', error);
    res.status(500).json({ error: 'Error al obtener los dispositivos' });
  }
});

// Obtener una lista de los recordatorios de un usuario en específico
app.get('/recordatorio/:userId', async (req, res) => {
  const userId = req.params.userId; // Obtén el ID del usuario de los parámetros de la URL

  try {
    const recordatorioDetalles = await Recordatorio.find({id_usuario: userId})
    res.json(recordatorioDetalles);
  } catch (error) {
    console.error('Error al obtener los detalles de los recordatorios:', error);
    res.status(500).json({ message: 'Error al obtener los detalles de los recordatorios' });
  }
});

app.post('/recordatorio', async (req,res) => {
  const { id_usuario, nombre_recordatorio, hora_recordatorio, dias_recordatorio, activo } = req.body;

    try {
        const newRecordatorio = new Recordatorio({
            nombre_recordatorio,
            hora_recordatorio,
            dias_recordatorio,
            id_usuario,
            activo
        });

        await newRecordatorio.save();

        res.status(201).json({ message: 'Recordatorio creado con éxito', recordatorio: newRecordatorio });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el recordatorio', error });
    }
})

// Actualizar un recordatorio
app.put('/recordatorio/:id', async (req, res) => {
  const id = req.params.id;
  const { activo } = req.body;

  try {
      const updatedReminder = await Recordatorio.findByIdAndUpdate(id, { activo }, { new: true });

      if (!updatedReminder) {
          return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      res.json(updatedReminder);
  } catch (error) {
      console.error('Error al actualizar el recordatorio:', error);
      res.status(500).json({ error: 'Error al actualizar el recordatorio' });
  }
});

// Obtener una lista de los recordatorios de un usuario en específico
app.get('/riegos/:userId', async (req, res) => {
  const userId = req.params.userId; // Obtén el ID del usuario de los parámetros de la URL

  try {
    const riegoDetalles = await Riego.find({id_usuario: userId})
    res.json(riegoDetalles);
  } catch (error) {
    console.error('Error al obtener los detalles del riego:', error);
    res.status(500).json({ message: 'Error al obtener los detalles del riego' });
  }
});

app.post('/riegos', async (req,res) => {
  const { id_usuario, hora_riego, dias_riego, activo } = req.body;

    try {
        const newRiego = new Riego({
            hora_riego,
            dias_riego,
            id_usuario,
            activo
        });

        await newRiego.save();

        res.status(201).json({ message: 'Riego creado con éxito', riego: newRiego });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el riego', error });
    }
})

// Actualizar un recordatorio
app.put('/riegos/:id', async (req, res) => {
  const id = req.params.id;
  const { activo } = req.body;

  try {
      const upateRiego = await Riego.findByIdAndUpdate(id, { activo }, { new: true });

      if (!upateRiego) {
          return res.status(404).json({ error: 'Riego no encontrado' });
      }
      res.json(upateRiego);
  } catch (error) {
      console.error('Error al actualizar el riego:', error);
      res.status(500).json({ error: 'Error al actualizar el riego' });
  }
});

// Obtener una lista de los productos registrados
app.get('/productos', async(req, res) => {
  Producto.find()
  .then(data => res.json(data))
  .catch(err => res.json(err));
})

// Obtener una lista de las ventas
app.get('/ventas', async (req, res) => {
  try {
    const ventasDetalles = await Ventas.aggregate([
      {
        $lookup: {
          from: 'Producto', 
          localField: 'id_producto',
          foreignField: '_id',
          as: 'producto'
        }
      },
      {
        $lookup: {
          from: 'Usuarios', 
          localField: 'id_usuario',
          foreignField: '_id',
          as: 'usuario'
        }
      },
      { $unwind: '$producto' },
      { $unwind: '$usuario' }
    ]);
    res.json(ventasDetalles);
  } catch (error) {
    console.error('Error al obtener los detalles de las ventas:', error);
    res.status(500).json({ message: 'Error al obtener los detalles de las ventas' });
  }
});

// Actualizar la contraseña de un usuario
app.post('/updatePass', async (req, res) => {
  const { correo_electronico, contrasena } = req.body

  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(contrasena, saltRounds)
    Usuarios.findOne({ correo_electronico })
    .then ((correoExistente) => {
      if (!correoExistente) {
        return res.status(401).json({ mensaje: "Este correo electrónico no está registrado"});
      } else {
        const pass = Usuarios.updateOne({ correo_electronico }, { contrasena: hash })
        .then ((pass) => {
          res.status(200).json({ mensaje: 'Contraseña actualizada'})
        })
        .catch ((error) => {
          res.status(500).json({ mensaje: 'Error al actualizar la contraseña'})
        })
      }
    })
  } catch (error) {
    console.error("Error al intentar actualizar la contraseña:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
})

// Actualizar la contraseña de un administrador
app.post('/updatePassAdmin', async (req, res) => {
  const { contrasena } = req.body; 
  try {
    const saltRounds = process.env.SALT_ROUND
    const hash = await bcrypt.hash(contrasena, saltRounds)
    const updatedUser = await Usuarios.findByIdAndUpdate(req.body.id, { contrasena: hash }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar los datos de un usuario
app.post('/updateUser', async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno} = req.body;

  try {
    Usuarios.findByIdAndUpdate(req.body.id, {
      nombre,
      apellido_paterno,
      apellido_materno
    })
    .then ((data) => {
      res.status(200).json({success: true, mensaje: 'Datos actualizados' })
    })
    .catch ((error) => {
      res.status(500).json({success: false, mensaje: 'Error al actualizar los datos' })
    })
  } catch (error) {
    return res.status(500).json({success: false, mensaje: 'Error interno del servidor' })
  }
})

app.post('/uploadProfileImage', async (req, res) => {
  const { id_usuario, image } = req.body;

  try {
      // Decodificar la imagen base64
      const buffer = Buffer.from(image, 'base64');
      
      // Definir la ruta relativa para guardar la imagen
      const relativeImagePath = `/uploads/${id_usuario}.jpg`;
      const imagePath = path.join(__dirname, relativeImagePath);

      // Guardar la imagen en el servidor
      fs.writeFileSync(imagePath, buffer);

      // Construir la URL completa de la imagen
      const imageUrl = `${req.protocol}://${req.get('host')}${relativeImagePath}`;

      console.log(imageUrl)

      // Actualizar al usuario con la ruta relativa de la imagen
      const user = await Usuarios.findByIdAndUpdate(id_usuario, { imagen_perfil: imageUrl });

      // Responder con éxito y la URL de la imagen
      res.status(200).json({ success: true, message: 'Imagen de perfil subida correctamente', user });
  } catch (error) {
      console.error('Error al subir la imagen', error);
      res.status(500).json({ success: false, message: 'Error interno al subir la imagen' });
  }
});

// Actualizar los datos de un producto
app.post('/updateProduct', async (req, res) => {
  const { nombre_producto, precio, stock } = req.body;

  try {
    Producto.findByIdAndUpdate(req.body.id, {
      nombre_producto,
      precio,
      stock,
    })
    .then ((data) => {
      res.status(200).json({ mensaje: 'Datos actualizados' })
    })
    .catch ((error) => {
      res.status(500).json({ mensaje: 'Error al actualizar los datos' })
    })
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

// Eliminar a un usuario
app.post('/deleteUser', async (req, res) => {
  try {
    await Ventas.deleteMany({id_usuario: req.body.id})
    await Cultivo.deleteMany({id_usuario: req.body.id})
    await Usuarios.findByIdAndDelete(req.body.id)
    .then((data) => {
      res.status(200).json({ mensaje: 'Usuario eliminado' })
    })
    .catch ((error) => {
      res.status(500).json({ mensaje: 'Error al eliminar al usuario' })
    })
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

// Eliminar un producto
app.post('/deleteProduct', async (req, res) => {
  try {
    Producto.findByIdAndDelete(req.body.id)
    .then((data) => {
      res.status(200).json({ mensaje: 'Producto eliminado' })
    })
    .catch ((error) => {
      res.status(500).json({ mensaje: 'Error al eliminar el producto' })
    })
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

// Obtener una lista de las colecciones en la base de datos
app.get('/collections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    res.json(collectionNames);
  } catch (error) {
    console.error('Error al obtener las colecciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener las colecciones' });
  }
});

// Realizar una copia de seguridad de la base de datos
app.post('/backup', async (req, res) => {
  const { collections, frecuencia } = req.body;

  const dumpPromises = collections.map((collection) => {
    const command = `mongodump --uri ${mongoURI} --collection ${collection} --out C:/Users/alvar/OneDrive/Documentos/GitHub/agroboost/src/Backup/`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  try {
    await Promise.all(dumpPromises);
    res.status(200).json({ message: 'Respaldo exitoso' });
  } catch (error) {
    console.error('Error al realizar el respaldo:', error);
    res.status(500).json({ message: 'Error al realizar el respaldo' });
  }
});

const verificationCodes = {};

// Generación de códigos de verificación
const generateVerificationCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code.toString().padStart(4, '0');
};

// Enviar un correo electrónico a un usuario
app.post('/send-mail', async (req, res) => {
  const { correo_electronico } = req.body;
  console.log('Solicitud recibida para:', correo_electronico);

  const verificationCode = generateVerificationCode();
  verificationCodes[correo_electronico] = verificationCode;

  const contentHTML = `
    <p>Estimado/a usuario,</p>
    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
    <p>Por favor, utiliza el siguiente código para restablecer tu contraseña:</p>
    <p><strong>${verificationCode}</strong></p>
    <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
    <p>Atentamente,<br>AgroBoost</p>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    secure: true,
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.PASS_GMAIL,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.USER_GMAIL,
      to: correo_electronico,
      subject: 'Restablecimiento de contraseña - AgroBoost',
      html: contentHTML
    });
    console.log('Correo enviado:', info);
    res.status(200).json({ mensaje: "Correo enviado" });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});


// Verificar un código de verificación
app.post('/verifyCode', (req, res) => {
  const { correo_electronico, code } = req.body;

  if (verificationCodes[correo_electronico] === code) {
    delete verificationCodes[correo_electronico];
    res.status(200).json({mensaje:"Código de verificación válido"});
  } else {
    res.status(400).json({mensaje:'Código de verificación inválido'});
  }
});

app.post('/resend-code', async (req, res) => {
  const { correo_electronico } = req.body;

  const newVerificationCode = generateVerificationCode();

  verificationCodes[correo_electronico] = newVerificationCode;

  // Envía el nuevo código al correo electrónico proporcionado
  const contentHTML = `
    <p>Estimado/a usuario,</p>
    <p>Recibimos una solicitud para reenviar el código de verificación para restablecer tu contraseña.</p>
    <p>Por favor, utiliza el siguiente código para restablecer tu contraseña:</p>
    <p><strong>${newVerificationCode}</strong></p>
    <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
    <p>Atentamente,<br>Equipo Patitas</p>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    secure: true,
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.PASS_GMAIL,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.USER_GMAIL,
    to: correo_electronico,
    subject: 'Restablecimiento de contraseña - AgroBoost',
    html: contentHTML
  });

  res.send("Correo enviado");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
