import React from "react";
import { Link } from "react-router-dom";

// Componente de tarea reutilizable
const Tarea = ({ tarea, actualizarEstado, borrarTarea }) => {
    return (
        <div className="card mb-2">
            <div className="card-body">
                <h5 className="card-title">{tarea.titulo}</h5>
                <p className="card-text">{tarea.descripcion}</p>
                <p><strong>Estado:</strong> {tarea.estado}</p>
                <Link to={`/detalle/${tarea.id}`} className="btn btn-info me-2">Ver detalle</Link>
                {tarea.estado === "En proceso" ? (
                    <button className="btn btn-warning" onClick={() => actualizarEstado(tarea.id)}>Marcar como finalizada</button>
                ) : (
                    <button className="btn btn-danger" onClick={() => borrarTarea(tarea.id)}>Borrar tarea</button>
                )}
            </div>
        </div>
    );
};

export default Tarea;