const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const taskRoutes = require('./taskRoutes');  // Importar las rutas de taskRoutes

router.post('/login', authController.login);
router.post('/register', authController.register);

// Usar las rutas de taskRoutes
router.use('/tasks', taskRoutes);

module.exports = router;
