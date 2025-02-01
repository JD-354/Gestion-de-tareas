const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Task = require('../models/Task');

// Middleware para verificar el token JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // 'Bearer token'

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido.' });
    }
    req.user = user; // Agregar el usuario decodificado al objeto de la solicitud
    next(); // Pasar al siguiente middleware o controlador
  });
};

// Ruta protegida para obtener las tareas
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }); // Filtrar tareas por el usuario
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas.' });
  }
});

// Ruta protegida para crear una nueva tarea
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      user: req.user.userId, // Asignar el usuario desde el token
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea.' });
  }
});

// Otras rutas para actualizar y eliminar tareas pueden ser similares, usando authenticateJWT

// Ruta protegida para eliminar una tarea
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    // Buscar la tarea por su ID y asegurarse de que pertenezca al usuario autenticado
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada o no autorizada para eliminar.' });
    }

    res.status(204).send(); // Respuesta de éxito, sin contenido
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la tarea.' });
  }
});

// Ruta protegida para actualizar una tarea
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId }, // Verifica que la tarea pertenece al usuario
      req.body, // Nuevos datos de la tarea
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada o no autorizada para editar.' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la tarea.' });
  }
});


module.exports = router