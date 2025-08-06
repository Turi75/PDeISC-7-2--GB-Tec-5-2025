import React from 'react';
import '../stylos/css.css';

// Componente simple que muestra un mensaje de saludo
function HolaMundo() {
  return (
    <div className="contenedor">
      <h1 className="titulo">¡Hola, mundo!</h1>
      <p className="descripcion">Este es mi primer componente en React con estilo personalizado.</p>
    </div>
  );
}

export default HolaMundo;