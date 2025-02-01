import React, { useState, useEffect } from 'react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { getTasks } from '../services/taskService';
import { useNavigate } from 'react-router-dom';
import logo from '../public/jpa-3d-logo.svg';


const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false); // Controla visibilidad del formulario flotante
  const [isClosing, setIsClosing] = useState(false); // Estado para animar la salida
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error al cargar tareas');
        navigate('/auth');
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleOpenTaskForm = () => {
    setIsClosing(false); // Reinicia el estado de cierre
    setShowTaskForm(true); // Muestra el formulario
    setShowFilterPanel(false); // Cierra el panel de filtros al abrir el formulario de tarea
  };

  const handleCloseTaskForm = () => {
    setIsClosing(true); // Activa la animación de salida
    setTimeout(() => {
      setShowTaskForm(false); // Esconde el formulario después de la animación
    }, 300); // Duración de la animación (coincide con el CSS)
  };

  const handleTaskCreated = () => {
    handleCloseTaskForm(); // Cierra el formulario después de crear la tarea
  };

  const handleFilterToggle = () => {
    setShowFilterPanel((prev) => !prev);
  };

  const handleApplyFilters = () => {
    setShowFilterPanel(false);
  };

  const handleShowAllTasks = () => {
    setFilters({ status: '', priority: '' });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status ? task.status === filters.status : true;
    const matchesPriority = filters.priority ? task.priority === filters.priority : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="dashboard">
      <div className="task-list ">
      <img src={logo} alt="Logo" className="logo" />

        <div className="buscador-contenedor flex items-center gap-4">
          <div className="search-bar relative">
            <input
              type="text"
              placeholder="Buscar tareas..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="button-gester" onClick={handleOpenTaskForm}>
            Añadir Tareas
          </button>
          <button
            className="button-gester"
            onClick={handleFilterToggle}
          >
            {showFilterPanel ? 'Cerrar Filtros' : 'Filtrar'}
          </button>
          <button
        className="button-gester"
            onClick={handleShowAllTasks}
            >
           My tasks
          </button>
        </div>
      </div>


      {showFilterPanel && (
        <div className="filter-panel-bg fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="filter-panel bg-gray-100 p-4 rounded-lg mb-6 max-w-sm mx-auto mt-20">
            <h2 className="button-gester">Filtrar Tareas</h2>
            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prevFilters) => ({ ...prevFilters, status: e.target.value }))
                }
              >
                <option value="">Estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prevFilters) => ({ ...prevFilters, priority: e.target.value }))
                }
              >
                <option value="">Prioridad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleApplyFilters}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskForm && (
        <div
          className={`floating-form-backdrop ${isClosing ? 'fade-out' : ''}`}
          onClick={handleCloseTaskForm}
        >
          <div
            className={`floating-form ${isClosing ? 'slide-out' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <TaskForm setTasks={setTasks} onTaskCreated={handleTaskCreated} />
          </div>
        </div>
      )}

      <TaskList tasks={filteredTasks} setTasks={setTasks} />
    </div>
  );
};

export default DashboardPage;
