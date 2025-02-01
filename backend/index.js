const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// backend/server.js
const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/nombreDeTuBaseDeDatos';  // Asegúrate de que la URL sea correcta

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error en la conexión a MongoDB:', error));

// Importar rutas
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Cargar variables de entorno desde un archivo .env
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json()); // Analizar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Analizar datos de formularios

// Rutas de la API
app.use('/api/tasks', taskRoutes); // Rutas de tareas
app.use('/api/auth', authRoutes); // Rutas de autenticación

// Ruta base para comprobar que el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});