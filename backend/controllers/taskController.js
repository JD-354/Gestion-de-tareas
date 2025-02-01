const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creando tarea' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { priority, status } = req.query;
    const filter = { user: req.userId };
    
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo tareas' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando tarea' });
  }
};