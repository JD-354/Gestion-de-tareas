import React, { useState, useEffect } from 'react';
import { createTask } from '../../services/taskService';

const TaskForm = ({ setTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('baja');
  const [isDateTimeSelected, setIsDateTimeSelected] = useState(false); // Para controlar si se seleccionó la fecha y hora

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = await createTask({
        title,
        description,
        dueDate: `${dueDate}T${dueTime}`, // Concatenamos la fecha y la hora
        priority
      });
      setTasks((prevTasks) => [...prevTasks, newTask]);
      // Limpiar formulario
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setPriority('baja');
      setIsDateTimeSelected(false); // Cerrar las tarjetas
    } catch (error) {
      console.error('Error creando tarea');
    }
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setDueTime(e.target.value);
  };

  return (
    <div className="task-form-card">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea"
          required
        />
        <textarea
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
        />
        
        {/* Mostrar tarjeta de fecha solo si no se ha seleccionado */}
        {!isDateTimeSelected && (
          <>
            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={handleDateChange}
              required
            />
            <input
              className="input"
              type="time"
              value={dueTime}
              onChange={handleTimeChange}
              required
            />
          </>
        )}

        {/* Si se ha seleccionado fecha y hora, ocultar las tarjetas */}
        {isDateTimeSelected && (
          <p>Fecha y hora seleccionadas: {new Date(`${dueDate}T${dueTime}`).toLocaleString()}</p>
        )}

        <select
          className="input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>

        <button
          className="button"
          type="submit"
          onClick={() => setIsDateTimeSelected(true)} // Marca como seleccionada la fecha y hora
        >
          Crear Tarea
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
