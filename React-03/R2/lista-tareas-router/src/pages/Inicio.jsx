import React from "react";
import { Link } from "react-router-dom";
import Tarea from "../components/Tarea";

// Página de inicio: lista de tareas
const Inicio = ({ tareas, actualizarEstado, borrarTarea }) => {
    return (
        <div>
            <Link to="/crear" className="btn btn-primary mb-3">Crear nueva tarea</Link>
            {tareas.length === 0 && <p>No hay tareas</p>}
            {tareas.map(t => (
                <Tarea key={t.id} tarea={t} actualizarEstado={actualizarEstado} borrarTarea={borrarTarea} />
            ))}
        </div>
    );
};

export default Inicio;