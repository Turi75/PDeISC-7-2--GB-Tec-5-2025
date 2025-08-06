import React, { useState } from 'react';
import '../stylos/css.css';

// Componente para gestionar una lista de tareas con opción de marcar como completadas
function ListaTareas() {
  const [tareas, setTareas] = useState([]); // Arreglo que almacena las tareas
  const [textoNuevaTarea, setTextoNuevaTarea] = useState(''); // Input de la nueva tarea

  // Agrega una tarea nueva a la lista
  const agregarTarea = () => {
    if (textoNuevaTarea.trim() === '') return;
    const nuevaTarea = {
      id: Date.now(), // ID único
      texto: textoNuevaTarea,
      completada: false,
    };
    setTareas([...tareas, nuevaTarea]);
    setTextoNuevaTarea('');
  };

  // Marca o desmarca una tarea como completada
  const toggleCompletada = (id) => {
    setTareas(
      tareas.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  return (
    <div className="lista-tareas">
      <h2>Lista de tareas</h2>

      {/* Formulario de entrada de tareas */}
      <input
        type="text"
        placeholder="Escribe una tarea..."
        value={textoNuevaTarea}
        onChange={(e) => setTextoNuevaTarea(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') agregarTarea(); }}
      />
      <button onClick={agregarTarea}>Agregar</button>

      {/* Lista de tareas mostradas */}
      <ul>
        {tareas.map(tarea => (
          <li
            key={tarea.id}
            className={tarea.completada ? 'tarea-completada' : ''}
            onClick={() => toggleCompletada(tarea.id)}
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;