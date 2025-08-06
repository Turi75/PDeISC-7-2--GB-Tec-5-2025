import React, { useState } from 'react';
import '../stylos/css.css';

// Componente que muestra un formulario para ingresar el nombre y saludar
function FormularioSimple() {
  const [nombre, setNombre] = useState(''); // Estado para el valor del input
  const [mensaje, setMensaje] = useState(''); // Estado para el mensaje de bienvenida

  // Función que maneja el envío del formulario
  const manejarEnvio = (e) => {
    e.preventDefault(); // Previene recarga de la página
    if (nombre.trim() === '') {
      setMensaje('Por favor, ingresa tu nombre.');
      return;
    }
    setMensaje(`¡Bienvenido/a, ${nombre}!`);
    setNombre('');
  };

  return (
    <div className="formulario-simple">
      <h2>Formulario simple</h2>

      {/* Formulario con input y botón */}
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Enviar</button>
      </form>

      {/* Mensaje de salida */}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default FormularioSimple;