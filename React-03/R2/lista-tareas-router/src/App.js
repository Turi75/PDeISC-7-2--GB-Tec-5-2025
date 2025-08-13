import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Detalle from "./pages/Detalle";
import Crear from "./pages/Crear";
import tareasIniciales from "./datos";
import "./stylos/css.css";

const App = () => {
    const [tareas, setTareas] = useState(tareasIniciales);

    // Función para agregar nueva tarea
    const agregarTarea = (tarea) => {
        const nuevaTarea = { ...tarea, id: tareas.length + 1, estado: "En proceso" };
        setTareas([...tareas, nuevaTarea]);
    };

    // Función para actualizar estado de tarea
    const actualizarEstado = (id) => {
        setTareas(tareas.map(t => t.id === id ? { ...t, estado: t.estado === "En proceso" ? "Finalizada" : t.estado } : t));
    };

    // Función para borrar tarea finalizada
    const borrarTarea = (id) => {
        setTareas(tareas.filter(t => t.id !== id));
    };

    return (
        <Router>
            <div className="container mt-4">
                <h1 className="text-center mb-4">Lista de Tareas</h1>
                <Routes>
                    <Route path="/" element={<Inicio tareas={tareas} actualizarEstado={actualizarEstado} borrarTarea={borrarTarea} />} />
                    <Route path="/detalle/:id" element={<Detalle tareas={tareas} />} />
                    <Route path="/crear" element={<Crear agregarTarea={agregarTarea} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;