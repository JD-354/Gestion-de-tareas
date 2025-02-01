import React from 'react';
import TaskList from './TaskList';  // Asegúrate de que la ruta a TaskList sea correcta
import TaskForm from './TaskForm';  // Asegúrate de que la ruta a TaskForm sea correcta

const TaskManagement = ({ tasks, setTasks }) => {
  return (
    <div className="task-management">
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default TaskManagement;
