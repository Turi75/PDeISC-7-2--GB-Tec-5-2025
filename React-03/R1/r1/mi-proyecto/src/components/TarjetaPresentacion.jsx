import React from 'react';
import '../stylos/css.css';
import YoFoto from '../imagenes/Yo_foto.jpg';

// Componente de presentación personal con imagen y datos pasados por props
function TarjetaPresentacion({ nombre, apellido, profesion }) {
  return (
    <div className="tarjeta">
      <img src={YoFoto} alt="Foto personal" className="imagen" />
      <h2>{nombre} {apellido}</h2>
      <p>{profesion}</p>
    </div>
  );
}

export default TarjetaPresentacion;