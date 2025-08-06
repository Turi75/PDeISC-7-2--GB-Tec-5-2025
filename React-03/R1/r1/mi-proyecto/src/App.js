import React, { useState } from 'react';
import './stylos/css.css';

// Importamos todos los componentes creados
import HolaMundo from './components/HolaMundo';
import TarjetaPresentacion from './components/TarjetaPresentacion';
import Contador from './components/contador';
import ListaTareas from './components/ListaTareas';
import FormularioSimple from './components/FormularioSimple';

function App() {
  // Estado que guarda cuál componente se debe mostrar
  const [componenteActual, setComponenteActual] = useState('hola');

  // Función que decide qué componente mostrar según la opción seleccionada
  const renderizarComponente = () => {
    switch (componenteActual) {
      case 'hola':
        return <HolaMundo />;
      case 'tarjeta':
        return (
          <TarjetaPresentacion
            nombre="Joaquín"
            apellido="Turi"
            profesion="Prof. Dr. J. Turi, neurocirujano de prestigio internacional y especialista en cirugía cerebral de alta complejidad."
          />
        );
      case 'contador':
        return <Contador />;
      case 'lista':
        return <ListaTareas />;
      case 'formulario':
        return <FormularioSimple />;
      default:
        return null;
    }
  };

  // Estructura del componente App: muestra un selector para elegir qué ver
  return (
    <div className="app">
      <h1 className="titulo-principal">Proyecto React</h1>

      {/* Selector para elegir el componente a mostrar */}
      <select
        onChange={(e) => setComponenteActual(e.target.value)}
        value={componenteActual}
      >
        <option value="hola">Hola Mundo</option>
        <option value="tarjeta">Tarjeta de Presentación</option>
        <option value="contador">Contador</option>
        <option value="lista">Lista de tareas</option>
        <option value="formulario">Formulario simple</option>
      </select>

      {/* Renderiza el componente seleccionado */}
      <div className="contenido">{renderizarComponente()}</div>
    </div>
  );
}

export default App;