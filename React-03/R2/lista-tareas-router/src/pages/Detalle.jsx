import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Página de detalle de tarea
const Detalle = ({ tareas }) => {
    const { id } = useParams();
    const tarea = tareas.find(t => t.id === parseInt(id));
    const navigate = useNavigate();

    if (!tarea) return <p>Tarea no encontrada</p>;

    return (
        <div className="detalle-card">
            <h2>{tarea.titulo}</h2>
            <p><strong>Descripción:</strong> {tarea.descripcion}</p>
            <p><strong>Estado:</strong> {tarea.estado}</p>
            <p><strong>ID:</strong> {tarea.id}</p>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>Volver</button>
        </div>
    );
};

export default Detalle;