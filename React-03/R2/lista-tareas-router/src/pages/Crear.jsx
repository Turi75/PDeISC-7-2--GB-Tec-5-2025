import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Página de creación de tarea
const Crear = ({ agregarTarea }) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const navigate = useNavigate();

    const manejarSubmit = (e) => {
        e.preventDefault();
        agregarTarea({ titulo, descripcion });
        setTitulo("");
        setDescripcion("");
        navigate("/");
    };

    return (
        <div>
            <h2>Crear Nueva Tarea</h2>
            <form onSubmit={manejarSubmit}>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input type="text" className="form-control" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success">Agregar tarea</button>
            </form>
            <Link to="/" className="btn btn-secondary mt-3">Volver</Link>
        </div>
    );
};

export default Crear;