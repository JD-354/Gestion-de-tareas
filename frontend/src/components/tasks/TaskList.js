import React, { useState, useEffect, useRef } from 'react';
import { updateTask, deleteTask } from '../../services/taskService';

const TaskList = ({ tasks, setTasks }) => {
  const [statusSelectorId, setStatusSelectorId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: '', description: '' });

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const playYouTubeSound = () => {
    // Crear un iframe oculto si no existe
    let existingIframe = document.getElementById('youtube-sound');
    
    if (!existingIframe) {
      const iframe = document.createElement('iframe');
      iframe.id = 'youtube-sound';
      iframe.width = '560';
      iframe.height = '315';
      iframe.src = 'https://www.youtube.com/embed/kY3ed62OYsk?autoplay=1&start=23';
      iframe.style.display = 'none'; // Ocultar el iframe
      iframe.allow = 'autoplay';
      
      document.body.appendChild(iframe);
    } else {
      // Si ya existe, cambia el src para reiniciar el sonido
      existingIframe.src = 'https://www.youtube.com/embed/kY3ed62OYsk?autoplay=1&start=23';
    }
  };

  const checkDueDate = (dueDate, title, description, taskId) => {
    const currentDate = new Date();
    const dueDateObject = new Date(dueDate);

    if (
      currentDate.getFullYear() === dueDateObject.getFullYear() &&
      currentDate.getMonth() === dueDateObject.getMonth() &&
      currentDate.getDate() === dueDateObject.getDate() &&
      currentDate.getHours() === dueDateObject.getHours() &&
      currentDate.getMinutes() === dueDateObject.getMinutes()
    ) {
      if (Notification.permission === 'granted') {
        const notification = new Notification(`Tarea Vencida: ${title}`, {
          body: description,
          icon: '/icon.png',
        });

        // Reproducir el sonido cuando aparece la notificación
        playYouTubeSound();

        // Detener el sonido cuando se cierre la notificación
        notification.onclose = () => {
          let iframe = document.getElementById('youtube-sound');
          if (iframe) {
            iframe.src = ''; // Detener el video al cerrar la notificación
          }
        };
      }

      handleStatusChange(taskId, 'completada');
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    const interval = setInterval(() => {
      tasks.forEach((task) => {
        checkDueDate(task.dueDate, task.title, task.description, task._id);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
      setStatusSelectorId(null);
    } catch (error) {
      console.error('Error actualizando tarea');
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({ title: task.title, description: task.description });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await updateTask(editingTaskId, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editingTaskId ? updatedTask : task
        )
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error editando tarea');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error eliminando tarea');
    }
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          {editingTaskId === task._id ? (
            <form className="edit-form" onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                placeholder="Título"
                required
              />
              <textarea
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                placeholder="Descripción"
                required
              />
              <button type="submit" className="task-btn save-btn">
                Guardar
              </button>
              <button
                type="button"
                className="task-btn cancel-btn"
                onClick={() => setEditingTaskId(null)}
              >
                Cancelar
              </button>
            </form>
          ) : (
            <>
              <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
              </div>
              <div className="task-card-body">
                <p className="task-desc">{task.description}</p>
                <p className="task-priority">Prioridad: {task.priority}</p>
                <p className="task-due-date">
                  Fecha de vencimiento:{' '}
                  {new Date(task.dueDate).toLocaleDateString()} a las{' '}
                  {new Date(task.dueDate).toLocaleTimeString()}
                </p>
                <div className="task-status">
                  <span>Estado: </span>
                  <span
                    onClick={() =>
                      setStatusSelectorId(
                        statusSelectorId === task._id ? null : task._id
                      )
                    }
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
              <div className="task-card-actions">
                <button
                  className="task-btn complete-btn"
                  onClick={() =>
                    setStatusSelectorId(
                      statusSelectorId === task._id ? null : task._id
                    )
                  }
                >
                  Cambiar estado
                </button>
                <button
                  className="task-btn edit-btn"
                  onClick={() => handleEditClick(task)}
                >
                  Editar
                </button>
                <button
                  className="task-btn delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Eliminar
                </button>
              </div>
            </>
          )}

          {statusSelectorId === task._id && (
            <div className="status-selector-card">
              <p className="status-selector-title">Cambiar estado:</p>
              <button
                className="status-btn"
                onClick={() => handleStatusChange(task._id, 'pendiente')}
              >
                Pendiente
              </button>
              <button
                className="status-btn"
                onClick={() => handleStatusChange(task._id, 'en-progreso')}
              >
                En Progreso
              </button>
              <button
                className="status-btn"
                onClick={() => handleStatusChange(task._id, 'completada')}
              >
                Completada
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Este iframe carga el video de YouTube pero solo reproduce el audio */}
      <div style={{ display: 'none' }}>
        <iframe
          id="youtube-sound"
          width="560"
          height="315"
          src=""
          title="YouTube Audio"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>
    </div>
  );
};

export default TaskList;
